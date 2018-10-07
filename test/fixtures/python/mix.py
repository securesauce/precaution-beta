# Copyright 2018 VMware, Inc.
# SPDX-License-Identifier: BSD-2-Clause

import ssl
from cryptography.hazmat import backends
from cryptography.hazmat.primitives.asymmetric import dsa
from cryptography.hazmat.primitives.ciphers.modes import ECB

dsa.generate_private_key(key_size=2048,
                         backend=backends.default_backend())
dsa.generate_private_key(key_size=1024,
                         backend=backends.default_backend())

ssl.wrap_socket(ssl_version=ssl.PROTOCOL_SSLv2)

mode = ECB(iv)

query = "SELECT * FROM foo WHERE id = '%s'" % identifier
