// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const config = {
  cleanupAfterRun: true,
  // I made it false because I had problem when its true. I get the error: App error
  // {"message":"Not Found","documentation_url":"https://developer.github.com/v3/repos/contents/#get-contents"}
  // here is the PR: https://github.com/MVrachev/Travic-CI---Tests/pull/393/checks?check_run_id=24015059 
  compareAgainstBaseline: false,
  fileExtensions: ['.py', '.pyw', '.go']
}

module.exports = config
