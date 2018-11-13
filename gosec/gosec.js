// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const parse = require('../parse_output.js')
const path = require('path')
const fs = require('fs')
const { config } = require('../config')

/**
 * Spawn a gosec process analyzing all the files in a given directory.
 * @param {string} directory Working directory for the Gosec process
 * @param {string} inputFiles List of input file paths for analy
 * @param {string?} reportFile Path to report file relative to working directory (default: gosec.json)
 * @returns {Promise} The contents of the gosec report
 */
module.exports = (directory, inputFiles, reportFile) => {
  if (!inputFiles) {
    return null
  }

  reportFile = reportFile || 'gosec.json'
  const reportPath = path.join(directory, reportFile)

  /**
  * @argument gosec command which the child process will execute
  * @argument -fmt output format of the command
  * @argument out flag which redirects the gosec output to a file
  * @argument reportPath the file where the output of gosec will be stored
  */
  let gosecArgs = ['-fmt=json', '-out', reportPath, inputFiles]

  let gosecProcess = spawn('gosec', gosecArgs)

  return new Promise((resolve, reject) => {
    gosecProcess
      .on('error', reject)
      .on('close', () => {
        if (fs.existsSync(reportPath)) {
          parse.readFile(reportPath, resolve, reject)
        } else {
          reject(Error(config.noGoFilesFound))
        }
      })
  })
}
