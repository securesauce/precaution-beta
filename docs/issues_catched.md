
# Issues Precaution finds

Precaution uses language-specific security static code analysis tools (linters) to identify issues, therefore the amount and types of checks vary by programming language. Some of the types of issues which Precaution detects include:

* [Hardcoded credentials](https://cwe.mitre.org/data/definitions/798.html)
* [SQL injection](https://cwe.mitre.org/data/definitions/89.html)
* [Command injection](https://cwe.mitre.org/data/definitions/77.html)
* [Weak random number generator](https://cwe.mitre.org/data/definitions/330.html)
* [Weak cryptographic algorithms](https://cwe.mitre.org/data/definitions/327.html)
* [Insecure libraries](https://cwe.mitre.org/data/definitions/829.html)
* [Specific insecure functions from libraries](https://cwe.mitre.org/data/definitions/749.html)
* [Inadequate encryption strength](https://cwe.mitre.org/data/definitions/326.html)
* [Eval function used](https://cwe.mitre.org/data/definitions/95.html)
* [TLS turned off or bad versions used](https://cwe.mitre.org/data/definitions/295.html)
* [Bad file permissions set during file creation](https://cwe.mitre.org/data/definitions/378.html)
* [Poor file permissions used with chmod](https://cwe.mitre.org/data/definitions/732.html)

**Note:** Precaution (through the underlying tools) warns developers of specific sections of code that may require security review.
As with all automated detection tools, there is a possibility of false positives.
You can read how to handle them here: [False positives and how to handle them](false_positivies.md)

Full documentation for the supported security checks (rules):
- Python: [Bandits rules](https://github.com/PyCQA/bandit#usage)
- Golang: [Gosecs rules](https://github.com/securego/gosec#available-rules)
- JavaScript/TypeScript: [Tslint security rules](https://github.com/webschik/tslint-config-security#rules)
