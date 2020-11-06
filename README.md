<!--
    Copyright 2018 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

![Precaution](precaution-logo.png)

[![Build Status](https://travis-ci.org/SecurityApps/precaution.svg?branch=master)](https://travis-ci.org/SecurityApps/precaution)
[![Coverage Status](https://codecov.io/gh/SecurityApps/precaution/branch/master/graph/badge.svg)](https://codecov.io/gh/SecurityApps/precaution)
[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://github.com/SecurityApps/precaution/blob/master/LICENSE.txt)

## Overview

Precaution provides simple, automated code reviews for GitHub projects by running
code linters with a security focus on all pull requests.

GitHub integration is made through the GitHub app interface and the checks API (beta),
which allows results to be presented directly as inline annotations instead of
a pass/fail status report.

Precaution currently supports analysis of:
* Go files via [Gosec](https://github.com/securego/gosec)
* JavaScript and TypeScript via [TSLint](https://github.com/palantir/tslint) and [tslint-config-security](https://github.com/webschik/tslint-config-security)
* Python files via [Bandit](https://github.com/PyCQA/bandit)

New languages may be added in future, please file an [issue](https://github.com/SecurityApps/precaution/issues) for your language/linter of choice.

* Documentation: [SecurityApps/precaution/docs](https://SecurityApps.github.io/precaution/)
* Source: [SecurityApps/precaution](https://github.com/SecurityApps/precaution)
* Bugs: [SecurityApps/precaution/issues](https://github.com/SecurityApps/precaution/issues)

## Installing Precaution on a GitHub repository

1. You can install Precaution from here: https://github.com/apps/precaution

2. Then choose the profile you want to connect Precaution with.

3. Next you have to choose which repositories you want to enable Precaution on. 

4. Review and accept the permissions for the GitHub app. These are the minimal permissions required to read the pull request contents
and communicate with the checks API.
 
5. Done! Now Precaution is installed on your repositories.

## Contributing

The Precaution project team welcomes contributions from the community. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License

BSD-2 License

## Any other questions? 
