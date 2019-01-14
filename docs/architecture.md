<!--
    Copyright 2019 VMware, Inc.
    SPDX-License-Identifier: BSD-2-Clause
-->

# Control Flow

![architecture](architecture.svg)

The app subscribes to event related to pull requests (opened, reopened) as well
as manual requests to re-run a check from the GitHub checks tab via the
check_suite.rerequested and check_run.rerequested events.

External API calls to GitHub are made asynchronously to not block the execution
thread.

External linters are spawned asynchronously, their output is redirected to
a file that is then read and converted to the format expected by GitHub checks.

The results are then merged and send back to GitHub with the appropriate status.
