from cryptography.hazmat import backends
from cryptography.hazmat.primitives.asymmetric import dsa
from cryptography.hazmat.primitives.asymmetric import rsa

dsa.generate_private_key(key_size=2048,
                         backend=backends.default_backend())

rsa.generate_private_key(public_exponent=65537,
                         key_size=2048,
                         backend=backends.default_backend())


dsa.generate_private_key(key_size=1024,
                         backend=backends.default_backend())

rsa.generate_private_key(public_exponent=65537,
                         key_size=1024,
                         backend=backends.default_backend())
