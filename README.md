# Frisk

[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://github.com/vmware/frisk/blob/master/LICENSE.txt)
[![Slack](https://img.shields.io/badge/slack-join%20chat%20%E2%86%92-e01563.svg)](https://code.vmware.com/web/code/join)

## Overview

Frisk provides a simple, automated code review for GitHub projects by running
code linters with a security focus on pull requests.

GitHub integration is made through the GitHub app interface and the checks API (beta),
which allows results to be presented directly as inline annotations instead of
a pass/fail status report.

## Local setup

Please refer to the [Probot documentation](https://probot.github.io/docs/development/#configuring-a-github-app)
to direct GitHub webhooks to your local machine.

Additionally make sure python is installed and run ```pip install -r requirements.txt```

### Deployment

This app requires the following **GitHub permissions** :
* Checks: **Read** and **Write**
* Pull requests: **Read**
* Code: **Read**
 Additionnally the app should subscribe to the **Pull requests** event.

## Documentation

## Releases & Major Branches

## Contributing

The Frisk project team welcomes contributions from the community. If you wish to contribute code and you have not
signed our contributor license agreement (CLA), our bot will update the issue when you open a Pull Request. For any
questions about the CLA process, please refer to our [FAQ](https://cla.vmware.com/faq). For more detailed information,
refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License

BSD-2 License