<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Precaution

[![Build Status](https://travis-ci.org/vmware/precaution.svg?branch=master)](https://travis-ci.org/vmware/precaution)
[![Coverage Status](https://codecov.io/gh/vmware/precaution/branch/master/graph/badge.svg)](https://codecov.io/gh/vmware/precaution)
[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://github.com/vmware/precaution/blob/master/LICENSE.txt)
[![Slack](https://img.shields.io/badge/slack-join%20chat%20%E2%86%92-e01563.svg)](https://code.vmware.com/web/code/join)

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

New languages may be added in future, please file an [issue](https://github.com/vmware/precaution/issues) for your language/linter of choice.

* Documentation: [vmware/precaution/docs](https://vmware.github.io/precaution/)
* Source: [vmware/precaution](https://github.com/vmware/precaution)
<!-- * Bugs: [vmware/precaution/issues](https://github.com/vmware/precaution/issues) -->

## Try Precaution

Check out the several sections and you can continue with your project but with it being secure.

- [Initial setup](initial_setup.md)
- [Setting up Precaution as branch protection rule](branch_protection_rule.md)
- [False positives and how to handle them](false_positivies.md)

## Contributers documentation

If you are enthusiastic about Precaution and want to improve it don't be concerned. Anyone can contribute, whether you’re new to the project or not.

- Bugs: [vmware/precaution/issues](https://github.com/vmware/precaution/issues)
- [Setting up a manual deployment](manual_deployment.md)
- [Debugging with VSCode](local_development.md)
- [Architecture](architecture.md)
- [Building this documentation locally](local_docs_build.md)
