<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Precaution configuration

Precaution uses a variety of linters under the hood without exposing implementation
details and complexity of the underlying tools to the user.
In order to prevent conflict with tool specific configuration,
Precaution ignores any tool specific configuration files which may exist in the
gtarget git repository and performs scans based solely on Precaution specific configuration.

Precaution provides you with the option to use `.precaution.yaml` configuration file.
This file **must** be in the root directory of your project.

All paths in the options should be **absolute**.

This file can be configured with the following options:

| Option | Syntax |
|---|---|
| [Exclude](#exclude) | [Globs](#globs) |

## Exclude

This option can be used to tell Precaution to exclude files or directories from processing.

This option accepts [Globs](#globs) syntax for defining patterns of files to exclude.

If you want to ignore `src/cmd/main.go` file you will add this to your configuration file:
```
exclude:
- "src/cmd/main.go"
```

Another use case is when you are using Golang and your dependencies are in
the `vendor/` folder. Then you can tell Precaution to skip all files
within the `vendor/` folder like this:
```
exclude:
- "vendor/**"
```

It's possible that you wouldn't want Precaution to scan your Golang test files. 
If the suffix in their names is `_test.go` then you can easily exclude them:
```
exclude:
- "*_test.go"
```

The exclude option supports multiple
exclude rules:
```
exclude:
- "*_test.go"
- "vendor/**"
- "src/cmd/main.go"
```

## Globs

| Pattern | Meaning |
|---|---|
| `abc/**` | Matches everything inside folder abc, including its child folders/subdirectories. |
| `?` | Matches any character except for `/` one time. |
| `*` | Matches any character except for `/` multiple times. |
| `[abc]` | Matches any characters inside the brackets. |

Here are some examples:

| Example | Meaning |
|---|---|
| `test/**` | All files under the test folder. |
| `foo?.py` | Matches `foo1.py`, `fooA.py`, `fooz.go`, etc. |
| `*.go` | All files with a .go extension. |
| `[xyz]`  | Matches`x`, `y`, or `z`. |


Other glob syntax features supported are:
- Brace Expansion
- Extended glob matching

For more detailed explanations of globs see:
- https://git-scm.com/docs/gitignore
- http://www.jedit.org/users-guide/globs.html
