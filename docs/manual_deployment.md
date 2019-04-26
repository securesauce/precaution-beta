<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Setting up a manual deployment

This requires two distinct steps: setting up the environment and dependencies, and registering a GitHub application pointing to your own running copy.

## Install dependencies

### Python and Bandit

1. Make sure Python2/Python3 is installed.
2. Make sure that pip/pip3 is installed.
3. Run ```pip install -r requirements.txt``` or ```pip3 install -r requirements.txt``` respectively

### Go and Gosec

1. Install Go if you haven't already: https://golang.org/doc/install
2. Add $GOPATH/bin into your PATH:
```export PATH=$PATH:${GOPATH}/bin```
3. Add the work folder to your GOPATH:
```export GOPATH=$GOPATH:$(pwd)/cache/go```
4. Download the latest version of gosec:

```
curl -sfL https://raw.githubusercontent.com/securego/gosec/master/install.sh | sh -s -- -b $GOPATH/bin 1.3.0
```
binary will be $GOPATH/bin/gosec

### Nodejs

1. Download Nodejs: https://nodejs.org/en/download/
2. Make sure you have installed npm
3. Run ```npm install ```

## Register the app

Please refer to the [GitHub app documentation](https://developer.github.com/apps/building-your-first-github-app/#one-time-setup) to get started on registering your own running instance of the app.

This app requires the following **GitHub permissions** :
* Checks: **Read** and **Write**
* Pull requests: **Read**
* Code: **Read**

Additionnally the app should subscribe to the **Pull requests** event.

## Redirect Github webhooks to your local machine

This can be useful when you are doing development work on Precaution itself and need a simple solution to trace the webhooks sent by GitHub and receive them without exposing your app to the internet.

Please refer to the [Probot documentation](https://probot.github.io/docs/development/#configuring-a-github-app)
to direct GitHub webhooks to your local machine.

## Testing

Run ```npm test```. This does not require any GitHub interaction (no need to register an instance of the app).