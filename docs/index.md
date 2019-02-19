<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Precaution

[![Build Status](https://travis-ci.com/vmware/precaution.svg?branch=master)](https://travis-ci.com/vmware/precaution)
[![Coverage Status](https://codecov.io/gh/vmware/precaution/branch/master/graph/badge.svg)](https://codecov.io/gh/vmware/precaution)
[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://github.com/vmware/precaution/blob/master/LICENSE.txt)
[![Slack](https://img.shields.io/badge/slack-join%20chat%20%E2%86%92-e01563.svg)](https://code.vmware.com/web/code/join)

## Overview

Precaution provides simple, automated code reviews for GitHub projects by running
code linters with a security focus on all pull requests.

GitHub integration is made through the GitHub app interface and the checks API (beta),
which allows results to be presented directly as inline annotations instead of
a pass/fail status report.

Precaution currently supports analysis of python files via Bandit and go files via Gosec. New languages may be added in future.

* Documentation: [vmware/precaution/docs](https://vmware.github.io/precaution/)
* Source: [vmware/precaution](https://github.com/vmware/precaution)
* Bugs: [vmware/precaution/issues](https://github.com/vmware/precaution/issues)


## Additional documentation

- [Initial setup](https://vmware.github.io/precaution/initial_setup.html)
- [False positives and how to handle them](https://vmware.github.io/precaution/false_positivies.html)
- [Setting up a manual deployment](https://vmware.github.io/precaution/manual_deployment.html)
- [Debugging with VSCode](https://vmware.github.io/precaution/local_development.html)
- [Architecture](https://vmware.github.io/precaution/architecture.html)
