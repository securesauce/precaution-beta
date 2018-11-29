// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const parse = require('../parse_output.js')
const path = require('path')

/**
 * Spawn a gosec process analyzing all the files in a given directory.
 * @param {string} directory Working directory for the Gosec process
 * @param {string[]} inputFiles List of input file paths for analyze
 * @param {string?} reportFile Path to report file relative to working directory (default: gosec.json)
 * @returns {Promise} The contents of the gosec report
 */
module.exports = (directory, inputFiles, reportFile) => {
  const goFiles = inputFiles.filter(fileName => fileName.endsWith('.go'))
  if (goFiles.length === 0) {
    return null
  }
  reportFile = reportFile || 'gosec.json'
  const reportPath = path.join(__dirname, '../', directory, reportFile)

  /**
  * @argument gosec command which the child process will execute
  * @argument -fmt output format of the command
  * @argument out flag which redirects the gosec output to a file
  * @argument reportPath the file where the output of gosec will be stored
  * @argument goFiles files which will be analyzed by gosec
  */
  let gosecArgs = ['-fmt=json', '-out', reportPath, goFiles]

  let gosecProcess = spawn('gosec', gosecArgs, { cwd: path.join(__dirname, '../', directory) })

  return new Promise((resolve, reject) => {
    gosecProcess
      .on('error', reject)
      .on('close', () => {
        parse.readFile(reportPath, resolve, reject)
      })
  })
}
