<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# False positives and how to handle them

As with all automated detection tools there will be cases of false positives.

If Precaution reports a failure that has been manually verified as being safe, it is possible to annotate the code with a `#nosec` comment.

Here are examples:

## Python example

Although this line may cause a potential security issue, it will not be reported:

```python
self.process = subprocess.Popen('/bin/echo', shell=True)  # nosec
```


If you want to read more about annotating the code:
[Bandit Exclusions](https://github.com/PyCQA/bandit#exclusions)

## Go example

In Go the annotation has to be inside a line or block comment:

```go

import "md5" // #nosec


func main(){

    /* #nosec */
    if x > y {
        h := md5.New() // this will also be ignored
    }

}

```

If you want to read more about annotating the code:
[Gosec Annotating code](https://github.com/securego/gosec#annotating-code)

## JavaScript/TypeScript Example

```javascript

const foo = "alert('hello')";
eval(foo); // tslint:disable-line

```

If you want to read more about annotating the code:
[TSLint rule flags](https://palantir.github.io/tslint/usage/rule-flags/)
