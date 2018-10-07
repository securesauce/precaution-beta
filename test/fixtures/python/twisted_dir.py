# Copyright 2018 VMware, Inc.
# SPDX-License-Identifier: BSD-2-Clause

from twisted.internet import reactor
from twisted.web import static, server, twcgi

root = static.File("/root")
root.putChild("cgi-bin", twcgi.CGIDirectory("/var/www/cgi-bin"))
reactor.listenTCP(80, server.Site(root))
reactor.run()
