
# False positives and how to handle them

As with all automated detection tools there will be cases of false positives.

If Precaution reports a failure that has been manually verified as being safe, it is possible to annotate the code with a `#nosec` comment.

Here are examples:

## Python example

Although this line may cause a potential security issue, it will not be reported:

``` self.process = subprocess.Popen('/bin/echo', shell=True)  # nosec ```

## Go example

Same here, with #nosec comment you basically say: "I know what I am doing don't warn me":

```go

import "md5" // #nosec


func main(){

    /* #nosec */
    if x > y {
        h := md5.New() // this will also be ignored
    }

}

```
