
# Events handling

## Subscribed events

Precaution needs to subscribe to a number of events
to satisfy different use cases.

The events are separated into two groups `PullRequestEvent` and `CheckRunEvent and CheckSuiteEvent`.

### PullRequestEvent

Official GitHub documentation: [PullRequestEvent](https://developer.github.com/v3/activity/events/types/#pullrequestevent)

#### `pull_request.opened`

- __occurs__: when a new pull request is created

- __triggers__: start of the Precaution scan

#### `pull_request.reopened`

- __occurs__: when a pull request is reopened from a closed state

- __triggers__: start of a new Precaution scan

#### `pull_request.synchronize`

- __occurs__: when you add a commit to already opened pull request

- __triggers__: start of a new Precaution scan

For more information see pull request [Fix for "across the forks" PRs problems](https://github.com/vmware/precaution/pull/113)


### CheckRunEvent and CheckSuiteEvent

Official GitHub documentation:
- [CheckRunEvent](https://developer.github.com/v3/activity/events/types/#checkrunevent)
- [CheckSuiteEvent](https://developer.github.com/v3/activity/events/types/#checksuiteevent)

A user had already opened a pull request and is at the pull request page.
They navigates to the "Checks" tab.
If the Precaution check failed they will see "Re-run all checks", "Re-run" and
"Re-run failed checks" buttons.

#### `check_run.rerequested`

- __occurs__: when you click the "Re-run" button

- __triggers__: start of a new Precaution scan

#### `check_suite.rerequested`

- __occurs__: when you click "Re-run all checks"
or "Re-run failed checks" buttons

- __triggers__: start of a new Precaution scan

## Event workflows

This paragraph doesn't aim to explain in detail how Precaution works.
If you want to understand more details of Precaution's design see the [Architecture](architecture.md) documentation.

There are numerous use cases but the triggered events and their order are alike.

### Pull request from a forked repository to an upstream repository or from upstream repository to itself

1. `pull_request.opened` webhook received
2. `POST /repos/:owner/:repo/check-runs` - API call to create check_run
3. `GET /repos/:owner/:repo/contents/:.precaution.yaml` - API call to get `.precaution.yaml` config file
4. `GET /repos/:owner/:repo/pulls/:number/files` - API call to get list of modified files
5. `GET /repos/:owner/:repo/contents/:path` - multiple API calls to get the modified files
6. `PATCH /repos/:owner/:repo/check-runs/:check_run_id` - API call which sends the results

### Add commit to already opened pull request

1. `pull_request.synchronize webhook` webhook received
2. `POST /repos/:owner/:repo/check-runs` - API call to create check_run
3. `GET /repos/:owner/:repo/contents/:.precaution.yaml` - API call to get `.precaution.yaml` config file
4. `GET /repos/:owner/:repo/pulls/:number/files` - API call to get list of modified files
5. `GET /repos/:owner/:repo/contents/:path` - multiple API calls to get the modified files
6. `PATCH /repos/:owner/:repo/check-runs/:check_run_id` - API call which sends the results

### "Re-run" button is clicked

1. `check_run.rerequested` webhook received
2. `POST /repos/:owner/:repo/check-runs` - API call to create check_run
3. `GET /repos/:owner/:repo/contents/:.precaution.yaml` - API call to get `.precaution.yaml` config file
4. `GET /repos/:owner/:repo/pulls/:number/files` - API call to get list of modified files
5. `GET /repos/:owner/:repo/contents/:path` - multiple API calls to get the modified files
6. `PATCH /repos/:owner/:repo/check-runs/:check_run_id` - API call which sends the results

### "Re-run all checks" or "Re-run failed checks" buttons are clicked

1. `check_suite.rerequested` webhook received
2. `POST /repos/:owner/:repo/check-runs` - API call to create check_run
3. `GET /repos/:owner/:repo/contents/:.precaution.yaml` - API call to get `.precaution.yaml` config file
4. `GET /repos/:owner/:repo/pulls/:number/files` - API call to get list of modified files
5. `GET /repos/:owner/:repo/contents/:path` - multiple API calls to get the modified files
6. `PATCH /repos/:owner/:repo/check-runs/:check_run_id` - API call which sends the results
