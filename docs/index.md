<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Precaution

## Overview

Precaution provides simple, automated code reviews for GitHub projects by running code linters with a security focus on all pull requests.

Precaution currently supports analysis of:
* Go files via [Gosec](https://github.com/securego/gosec)
* JavaScript and TypeScript via [TSLint](https://github.com/palantir/tslint) and [tslint-config-security](https://github.com/webschik/tslint-config-security)
* Python files via [Bandit](https://github.com/PyCQA/bandit)

## Using the Precaution GitHub App

- [Initial setup for your repository](initial_setup.md)
- [Marking code to ignore with exclusions](false_positivies.md)

## Deploying your own instance of Precaution

- [Setting up a manual deployment](manual_deployment.md)

## Developing Precaution

- [Debugging with VSCode](local_development.md)
- [Architecture](architecture.md)
- [Building this documentation locally](local_docs_build.md)

## Precaution community

* Fork us on GitHub: [vmware/precaution](https://github.com/vmware/precaution)
* File bugs and enhancement requests: [vmware/precaution/issues](https://github.com/vmware/precaution/issues)
* Chat with us on Slack: [VMware Code](https://code.vmware.com/web/code/join)
