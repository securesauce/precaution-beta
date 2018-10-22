# Frisk

[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://github.com/vmware/frisk/blob/master/LICENSE.txt)
[![Slack](https://img.shields.io/badge/slack-join%20chat%20%E2%86%92-e01563.svg)](https://code.vmware.com/web/code/join)

## Overview

Frisk provides a simple, automated code review for GitHub projects by running
code linters with a security focus on pull requests.

GitHub integration is made through the GitHub app interface and the checks API (beta),
which allows results to be presented directly as inline annotations instead of
a pass/fail status report.

Frisk supports analysis of python files via Bandit. New languages may be added in future.

## Set up Frisk

1. You can install Frisk from here: [ weblink to Frisk app installation ]

2. Then choose the profile you want to connect Frisk with.

3. Next you have to choose over which repositories do you want to use Frisk on. 

4. Below that read carefully what kind of data Frisk needs to operate. 
We guarantee that we use minimal amount of permissions and all of them are connected with the functionality of Frisk. No information will be leaked!
 
5. Done! Now Frisk is installed.


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

### Testing

Run ```npm test``` or ```yarn test```.

## Documentation

## Releases & Major Branches

## Contributing

The Frisk project team welcomes contributions from the community. Before you start working with Frisk, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License

BSD-2 License
