// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const cache = require('../cache')

const report = require('../bandit/bandit_report')

module.exports = class Bandit {
  get name () {
    return 'bandit'
  }

  get reportPath () {
    return '../bandit.json'
  }

  filter (files) {
    return files.filter(name => name.endsWith('.py'))
  }

  workingDirectoryForPR (repoID, prID) {
    return cache.getBranchPath(repoID, prID)
  }

  args (files) {
    return ['--format', 'json', '-o', this.reportPath, ...files]
  }

  parseResults (data) {
    return JSON.parse(data)
  }

  generateReport (results) {
    return report(results)
  }
}
