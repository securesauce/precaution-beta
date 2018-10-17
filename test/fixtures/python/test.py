
import os

def someFunction(user, password="Admin"):
    print("Hi " + user)

def someFunction2(password):
    if password == "root":
        print("OK, logged in")

def noMatch(password):
    if password == '':
        print("No password!")

def NoMatch2(password):
    if password == "ajklawejrkl42348swfgkg":
        print("Nice password!")

def doLogin(password="blerg"):
    pass

def NoMatch3(a, b):
    pass

os.chmod('/etc/passwd', 0227)
os.chmod('~/.bashrc', 511)