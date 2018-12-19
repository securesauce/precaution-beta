// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const merge = require('./merge_reports')
const Bandit = require('./linters/bandit')
const Gosec = require('./linters/gosec')

async function runLinters (files, repoID, prID) {
  // TODO: Sync with file download location resolution
  const bandit = new Bandit()
  const banditReport = run(bandit, bandit.workingDirectoryForPR(repoID, prID), files)
  const gosec = new Gosec()
  const gosecReport = run(gosec, gosec.workingDirectoryForPR(repoID, prID), files)

  return merge(await banditReport, await gosecReport)
}

/**
 *
 * @param {*} linter
 * @param {string[]} files
 * @returns {Promise<any>} A promise for the report object with the analysis results,
 *                         or null if there were no files to analyze
 */
function run (linter, workingDirectory, files) {
  const filtered = linter.filter(files)

  if (filtered.length === 0) { return null }

  const process = spawn(linter.name, linter.args(filtered), { cwd: workingDirectory })
  const reportFilePath = path.join(workingDirectory, linter.reportPath)

  // Promise report generation
  return new Promise((resolve, reject) => {
    process.on('error', reject)
    process.on('close', () => reportHandler(linter, reportFilePath, resolve, reject))
  })
}

function reportHandler (linter, reportFilePath, resolve, reject) {
  fs.readFile(reportFilePath, (err, data) => {
    if (err) { reject(err) } else {
      const results = linter.parseResults(data)
      const report = linter.generateReport(results)
      resolve(report)
    }
  })
}

module.exports.runLinters = runLinters
module.exports.run = run
