// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const cache = require('../../cache')

const report = require('./bandit_report')

module.exports = class Bandit {
  get name () {
    return 'bandit'
  }

  /**
   * The name of the generated report file
   */
  get reportFile () {
    return 'bandit_output.json'
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
    return files.filter(name => name.endsWith('.py'))
  }

  /**
   * Returns the working directory for this analysis
   * @param {string} repoID Unique repository id
   * @param {string} prID PR id in repository
   */
  workingDirectoryForPR (repoID, prID) {
    return cache.getBranchPath(repoID, prID, 'bandit')
  }

  /**
   * Builds the command line args to pass to the linter process
   * @param {string[]} files List of files to analyze
   * @param {string} reportPath Path to the report file relative to working directory
   */
  args (files, reportPath) {
    return ['--format', 'json', '-o', reportPath, ...files]
  }

  /**
   * Parses the linter results
   * @param {Buffer} data The raw linter results data
   */
  parseResults (data) {
    let parsedData = JSON.parse(data)

    for (let error of parsedData.errors) {
      let errAnnotation = {
        filename: error.filename,
        line_number: 1,
        issue_severity: 'HIGH',
        issue_confidence: 'HIGH',
        issue_text: '',
        test_id: 'ERROR',
        test_name: 'Syntax error'
      }

      errAnnotation.issue_text = 'Error: ' + error.reason + ' ' + error.filename
      parsedData.results.push(errAnnotation)
    }
    return parsedData
  }

  /**
   * Generates a report in the format expected by GitHub checks
   * from the linter results
   * @param {any} results Linter results
   * @param {any} directory current working directory
   * @returns GitHub checks report
   */
  generateReport (results, directory) {
    return report(results)
  }
}
