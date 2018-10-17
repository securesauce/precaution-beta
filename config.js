// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const config = {
  cleanupAfterRun: true,
  // I made it false because I had problem when its true. I get the error: App error
  // {"message":"Not Found","documentation_url":"https://developer.github.com/v3/repos/contents/#get-contents"}
  compareAgainstBaseline: true,
  fileExtensions: ['.py', '.pyw', '.go']
}

module.exports = config
