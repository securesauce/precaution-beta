## Copyright 2019 VMware, Inc.
## SPDX-License-Identifier: BSD-2-Clause

"""
Connect to a VMOMI ServiceInstance.

Detailed description (for [e]pydoc goes here).
"""
from six import reraise
import sys
import re
import ssl
from xml.etree import ElementTree
from xml.parsers.expat import ExpatError
from six.moves import http_client

import requests
from requests.auth import HTTPBasicAuth

from pyVmomi import vim, vmodl, SoapStubAdapter, SessionOrientedStub
from pyVmomi.SoapAdapter import CONNECTION_POOL_IDLE_TIMEOUT_SEC
from pyVmomi.VmomiSupport import nsMap, versionIdMap, versionMap, IsChildVersion
from pyVmomi.VmomiSupport import GetServiceVersions


"""
Global regular expression for parsing host and port connection
See http://www.ietf.org/rfc/rfc3986.txt sec 3.2.2
"""
_rx = re.compile(r"(^\[.+\]|[^:]+)(:\d+)?$")

_si = None
"""
Global (thread-shared) ServiceInstance

@todo: Get rid of me?
"""


def localSslFixup(host, sslContext):
    """
    Connections to 'localhost' do not need SSL verification as a certificate
    will never match. The OS provides security by only allowing root to bind
    to low-numbered ports.
    """
    if not sslContext and host in ['localhost', '127.0.0.1', '::1']:
        import ssl
        if hasattr(ssl, '_create_unverified_context'):
            sslContext = ssl._create_unverified_context()
    return sslContext

class closing(object):
   """
   Helper class for using closable objects in a 'with' statement,
   similar to the one provided by contextlib.
   """
   def __init__(self, obj):
      self.obj = obj
   def __enter__(self):
      return self.obj
   def __exit__(self, *exc_info):
      self.obj.close()


class VimSessionOrientedStub(SessionOrientedStub):
   '''A vim-specific SessionOrientedStub.  See the SessionOrientedStub class
   in pyVmomi/SoapAdapter.py for more information.'''

   # The set of exceptions that should trigger a relogin by the session stub.
   SESSION_EXCEPTIONS = (
      vim.fault.NotAuthenticated,
      )

   @staticmethod
   def makeUserLoginMethod(username, password, locale=None):
      '''Return a function that will call the vim.SessionManager.Login() method
      with the given parameters.  The result of this function can be passed as
      the "loginMethod" to a SessionOrientedStub constructor.'''
      def _doLogin(soapStub):
         si = vim.ServiceInstance("ServiceInstance", soapStub)
         sm = si.content.sessionManager
         if not sm.currentSession:
            si.content.sessionManager.Login(username, password, locale)

      return _doLogin

   @staticmethod
   def makeExtensionLoginMethod(extensionKey):
      '''Return a function that will call the vim.SessionManager.Login() method
      with the given parameters.  The result of this function can be passed as
      the "loginMethod" to a SessionOrientedStub constructor.'''
      def _doLogin(soapStub):
         si = vim.ServiceInstance("ServiceInstance", soapStub)
         sm = si.content.sessionManager
         if not sm.currentSession:
            si.content.sessionManager.LoginExtensionByCertificate(extensionKey)

      return _doLogin

   @staticmethod
   def makeCertHokTokenLoginMethod(stsUrl, stsCert=None):
      '''Return a function that will call the vim.SessionManager.LoginByToken()
      after obtaining a HoK SAML token from the STS. The result of this function
      can be passed as the "loginMethod" to a SessionOrientedStub constructor.

      @param stsUrl: URL of the SAML Token issuing service. (i.e. SSO server).
      @param stsCert: public key of the STS service.
      '''
      assert(stsUrl)

      def _doLogin(soapStub):
         from . import sso
         cert =  soapStub.schemeArgs['cert_file']
         key = soapStub.schemeArgs['key_file']
         authenticator = sso.SsoAuthenticator(sts_url=stsUrl,
                                              sts_cert=stsCert)

         samlAssertion = authenticator.get_hok_saml_assertion(cert,key)


         def _requestModifier(request):
            return sso.add_saml_context(request, samlAssertion, key)

         si = vim.ServiceInstance("ServiceInstance", soapStub)
         sm = si.content.sessionManager
         if not sm.currentSession:
            with soapStub.requestModifier(_requestModifier):
               try:
                  soapStub.samlToken = samlAssertion
                  si.content.sessionManager.LoginByToken()
               finally:
                  soapStub.samlToken = None

      return _doLogin

   @staticmethod
   def makeCredBearerTokenLoginMethod(username,
                                      password,
                                      stsUrl,
                                      stsCert=None):
      '''Return a function that will call the vim.SessionManager.LoginByToken()
      after obtaining a Bearer token from the STS. The result of this function
      can be passed as the "loginMethod" to a SessionOrientedStub constructor.

      @param username: username of the user/service registered with STS.
      @param password: password of the user/service registered with STS.
      @param stsUrl: URL of the SAML Token issueing service. (i.e. SSO server).
      @param stsCert: public key of the STS service.
      '''
      assert(username)
      assert(password)
      assert(stsUrl)

      def _doLogin(soapStub):
         from . import sso
         cert = soapStub.schemeArgs['cert_file']
         key = soapStub.schemeArgs['key_file']
         authenticator = sso.SsoAuthenticator(sts_url=stsUrl,
                                              sts_cert=stsCert)
         samlAssertion = authenticator.get_bearer_saml_assertion(username,
                                                                 password,
                                                                 cert,
                                                                 key)
         si = vim.ServiceInstance("ServiceInstance", soapStub)
         sm = si.content.sessionManager
         if not sm.currentSession:
            try:
               soapStub.samlToken = samlAssertion
               si.content.sessionManager.LoginByToken()
            finally:
               soapStub.samlToken = None

      return _doLogin


def Connect(host='localhost', port=443, user='root', pwd,
            service="hostd", adapter="SOAP", namespace=None, path="/sdk",
            connectionPoolTimeout=CONNECTION_POOL_IDLE_TIMEOUT_SEC,
            version=None, keyFile=None, certFile=None, thumbprint=None,
            sslContext=None, b64token=None, mechanism='userpass'):
   """
   Connect to the specified server, login and return the service
   instance object.

   Throws any exception back to caller. The service instance object is
   also saved in the library for easy access.

   Clients should modify the service parameter only when connecting to
   a VMOMI server other than hostd/vpxd. For both of the latter, the
   default value is fine.

   @param host: Which host to connect to.
   @type  host: string
   @param port: Port
   @type  port: int
   @param user: User
   @type  user: string
   @param pwd: Password
   @type  pwd: string
   @param service: Service
   @type  service: string
   @param adapter: Adapter
   @type  adapter: string
   @param namespace: Namespace *** Deprecated: Use version instead ***
   @type  namespace: string
   @param path: Path
   @type  path: string
   @param connectionPoolTimeout: Timeout in secs for idle connections to close, specify negative numbers for never
                                 closing the connections
   @type  connectionPoolTimeout: int
   @param version: Version
   @type  version: string
   @param keyFile: ssl key file path
   @type  keyFile: string
   @param certFile: ssl cert file path
   @type  certFile: string
   @param thumbprint: host cert thumbprint
   @type  thumbprint: string
   @param sslContext: SSL Context describing the various SSL options. It is only
                      supported in Python 2.7.9 or higher.
   @type  sslContext: SSL.Context
   @param b64token: base64 encoded token
   @type  b64token: string
   @param mechanism: authentication mechanism: userpass or sspi
   @type  mechanism: string
   """
   try:
      info = re.match(_rx, host)
      if info is not None:
         host = info.group(1)
         if host[0] == '[':
            host = info.group(1)[1:-1]
         if info.group(2) is not None:
            port = int(info.group(2)[1:])
   except ValueError as ve:
      pass

   sslContext = localSslFixup(host, sslContext)

   if namespace:
      assert(version is None)
      version = versionMap[namespace]
   elif not version:
      version = "vim.version.version6"

   si, stub = None, None
   if mechanism == 'userpass':
      si, stub = __Login(host, port, user, pwd, service, adapter, version, path,
                         keyFile, certFile, thumbprint, sslContext, connectionPoolTimeout)
   elif mechanism == 'sspi':
      si, stub = __LoginBySSPI(host, port, service, adapter, version, path,
                               keyFile, certFile, thumbprint, sslContext, b64token, connectionPoolTimeout)
   else:
      raise Exception('''The provided connection mechanism is not available, the
              supported mechanisms are userpass or sspi''')

   SetSi(si)

   return si