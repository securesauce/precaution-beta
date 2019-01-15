// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const merge = require('./merge_reports')
const linters = require('./linters')

/**
 * Run all linters on specified files
 * @param {string[]} files Files to analyze
 * @param {string} repoID
 * @param {string} prID
 */
async function runLinters (files, repoID, prID) {
  // TODO: Sync directory with file download location resolution
  const reports = Object.values(linters).map((linter) => run(linter, linter.workingDirectoryForPR(repoID, prID), files))

  return merge(await Promise.all(reports))
}

/**
 * Linter driver logic: spawn a child process, gather the results and build
 * a report
 * @param {*} linter A linter instance
 * @param {string} workingDirectory The path to the process working directory
 * @param {string[]} files Files to analyze
 * @returns {Promise<any>} A promise for the report object with the analysis results
 */
function run (linter, workingDirectory, files) {
  const filtered = linter.filter(files)

  if (filtered.length === 0) { return linter.defaultReport }

  const reportFilePath = path.join(workingDirectory, '..', linter.reportFile)
  const process = spawn(linter.name, linter.args(filtered, path.join('..', linter.reportFile)), { cwd: workingDirectory })

  let errorLogs = ''
  process.stderr.on('data', (chunk) => {
    errorLogs += chunk.toString()
  })

  // Promise report generation
  return new Promise((resolve, reject) => {
    process.on('error', reject)
    process.on('close', () => reportHandler(linter, reportFilePath, resolve, reject, errorLogs))
  })
}

function reportHandler (linter, reportFilePath, resolve, reject, logs) {
  fs.readFile(reportFilePath, 'utf8', (err, data) => {
    if (err) {
      console.log('Could not read linter results: ' + reportFilePath)
      console.log('stderr: ' + logs)
      return reject(err)
    } else {
      const results = linter.parseResults(data)
      const report = linter.generateReport(results)
      return resolve(report)
    }
  })
}

module.exports.runLinters = runLinters
module.exports.run = run
