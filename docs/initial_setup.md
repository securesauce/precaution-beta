<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Initial setup

## Run static code analysis tooling (recommended)

For best results, prior to using Precaution, it is recommended to run static code analysis tooling on the code base. That way the current code base does not contain known security issues.

The table below lists the languages supported by Precaution and the static analysis tools used by Precaution in support of the language.
You should use the appropriate tool from the list for your initial scans before enabling Precaution.

| Language | Static analysis tool |
|---|---|
| Go | [Gosec](https://github.com/securego/gosec) |
| JavaScript | [TSLint](https://github.com/palantir/tslint) and [tslint-config-security](https://github.com/webschik/tslint-config-security) |
| Python | [Bandit](https://github.com/PyCQA/bandit) |
| TypeScript | [TSLint](https://github.com/palantir/tslint) and [tslint-config-security](https://github.com/webschik/tslint-config-security) |


## Setting up a Branch Protection Rule (optional)

By default, after Precaution is installed, it will not automatically prevent the merging of a pull request even if the check resulted in a failure status.

![check_fails](./images/check_fails.png)

In order to allow Precaution to prevent pull requests from merging 
you should follow those steps: [Enabling Precaution as branch protection rule](branch_protection_rule.md)