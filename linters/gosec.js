// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const cache = require('../cache')

const report = require('../gosec/gosec_report')

module.exports = class Gosec {
  get name () {
    return 'gosec'
  }

  get reportPath () {
    return '../gosec.json'
  }

  filter (files) {
    return files.filter(name => name.endsWith('.go'))
  }

  workingDirectoryForPR (repoID, prID) {
    return cache.getBranchPath(repoID, prID, 'head', 'gosec')
  }

  args (files) {
    return ['-fmt=json', '-out', this.reportPath, './...']
  }

  parseResults (data) {
    return JSON.parse(data)
  }

  generateReport (results) {
    return report(results)
  }
}
