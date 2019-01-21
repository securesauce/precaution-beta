<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Setting up a manual deployment

This requires two distinct steps: setting up the environment and dependencies, and registering a GitHub application pointing to your own running copy.

## Install dependencies

### Python and Bandit

1. Make sure Python is installed 
2. Run ```pip install -r requirements.txt```

### Go and Gosec

1. Install Go if you haven't already: https://golang.org/doc/install 
2. Download the latest version of gosec:
```go get github.com/securego/gosec```
3. Add $GOPATH/bin into your PATH:
```export PATH=$PATH:${GOPATH}/bin```
4. Add the work folder to your gopath:
```export GOPATH=$GOPATH:$(pwd)/cache/go```

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

Run ```npm test``` or ```yarn test```. This does not require any GitHub interaction (no need to register an instance of the app).