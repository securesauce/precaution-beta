// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const parse = require('../parse_output.js')
const path = require('path')
const fs = require('fs')
const { config } = require('../config')

/**
 * Spawn a gosec process analyzing all the files in a given directory.
 * @param {string} workingDirectory The working directory for the gosec process
 * @param {string?} reportFile Path to report file relative to working directory (default: gosec.json)
 * @returns {Promise} The contents of the gosec report
 */
module.exports = (workingDirectory, reportFile) => {
  if (!workingDirectory) {
    return null
  }

  reportFile = reportFile || 'gosec.json'
  const reportPath = path.join(workingDirectory, reportFile)
  // When I use "/..." as suffix I call gosec recursively in any existing subfolder of current working Director
  // It will use gosec for analyze  recursively the same way until it can
  workingDirectory += '/...'

  /**
  * @argument gosec : command which the child process will execute
  * @argument -fmt : output format of the command
  * @argument out : output file for results
  * @argument workingDirectory : Directory containing files for which the command will be executed
  */
  let gosecProcess = spawn('gosec', ['-fmt=json', '-out', reportPath, workingDirectory])

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
