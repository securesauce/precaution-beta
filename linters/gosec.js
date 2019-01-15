// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const cache = require('../cache')

const report = require('../gosec/gosec_report')

module.exports = class Gosec {
  get name () {
    return 'gosec'
  }

  /**
   * The name of the generated report file
   */
  get reportFile () {
    return 'gosec.json'
  }

  get defaultReport () {
    return { annotations: [], issueCount: { errors: 0, warnings: 0, notices: 0 }, moreInfo: '' }
  }

  /**
   * Retains files that can be analyzed by this linter
   * @param {string[]} files Names of files to analyze
   * @returns {string[]} Filtered list of file names
   */
  filter (files) {
    return files.filter(name => name.endsWith('.go'))
  }

  /**
   * Returns the working directory for this analysis
   * @param {string} repoID Unique repository id
   * @param {string} prID PR id in repository
   */
  workingDirectoryForPR (repoID, prID) {
    return cache.getBranchPath(repoID, prID, 'gosec')
  }

  /**
   * Builds the command line args to pass to the linter process
   * @param {string[]} files List of files to analyze
   * @param {string} reportPath Path to the report file relative to working directory
   */
  args (files, reportPath) {
    return ['-fmt=json', '-out', reportPath, './...']
  }

  /**
   * Parses the linter results
   * @param {Buffer} data The raw linter results data
   */
  parseResults (data) {
    return JSON.parse(data)
  }

  /**
   * Generates a report in the format expected by GitHub checks
   * from the linter results
   * @param {any} results Linter results
   * @returns GitHub checks report
   */
  generateReport (results) {
    return report(results)
  }
}
