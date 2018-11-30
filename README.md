# Precaution

[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://github.com/vmware/precaution/blob/master/LICENSE.txt)
[![Slack](https://img.shields.io/badge/slack-join%20chat%20%E2%86%92-e01563.svg)](https://code.vmware.com/web/code/join)

## Overview

Precaution provides simple, automated code reviews for GitHub projects by running
code linters with a security focus on all pull requests.

GitHub integration is made through the GitHub app interface and the checks API (beta),
which allows results to be presented directly as inline annotations instead of
a pass/fail status report.


Precaution currently supports analysis of python files via Bandit. New languages may be added in future.

## Setup

1. You can install Precaution from here: [ weblink to Precaution app installation ]

2. Then choose the profile you want to connect Precaution with.

3. Next you have to choose which repositories you want to enable Precaution on. 

4. Review and accept the permissions for the GitHub app. These are the minimal permissions required to read the pull request contents
and communicate with the checks API.
 
5. Done! Now Precaution is installed on your repositories.


## Local development setup

### Redirect Github webhooks to your local machine

Please refer to the [Probot documentation](https://probot.github.io/docs/development/#configuring-a-github-app)
to direct GitHub webhooks to your local machine.

### Set up all dependencies


#### Python and Bandit

1. Make sure Python is installed 
2. Run ```pip install -r requirements.txt```


#### Go and Gosec

1. Install Go if you haven't already: https://golang.org/doc/install 
2. Download the latest version of gosec from here: https://github.com/securego/gosec/releases
3. Make sure your GOPATH variable is set to the proper path
4. Add $GOPATH/bin into your PATH environmental variable. 


### Deployment

This app requires the following **GitHub permissions** :
* Checks: **Read** and **Write**
* Pull requests: **Read**
* Code: **Read**

Additionnally the app should subscribe to the **Pull requests** event.

### Testing

Run ```npm test``` or ```yarn test```. This does not require any GitHub interaction (no need to register an instance of the app).

## Documentation

## Releases & Major Branches

## Contributing

The Precaution project team welcomes contributions from the community. Before you start working with Precaution, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License

BSD-2 License
