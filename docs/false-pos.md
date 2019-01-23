
# False positives and how to handle them

No tool is perfect, neither is Precaution and false positives may happened.

The way to handle this situation is to write #nosec in your code

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