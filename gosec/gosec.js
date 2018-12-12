// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const parse = require('../parse_output.js')
const path = require('path')
const fs = require('fs')

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
  const currentDirectory = path.resolve(directory)
  /**
  * @argument gosec command which the child process will execute
  * @argument -fmt output format of the command
  * @argument out flag which redirects the gosec output to a file
  * @argument reportFile the file where the output of gosec will be stored
  * @argument goFiles files which will be analyzed by gosec
  */
  let gosecArgs = ['-fmt=json', '-out', reportFile, './...']

  let gosecProcess = spawn('gosec', gosecArgs, { cwd: currentDirectory })

  let logs = ''
  gosecProcess.stderr.on('data', function (data) {
    logs += data.toString()
  })

  return new Promise((resolve, reject) => {
    gosecProcess
      .on('error', reject)
      .on('close', () => {
        if (!fs.existsSync(path.join(currentDirectory, reportFile))) {
          console.log('The logs for Gosec are: ')
          console.log(logs)
        }
        parse.readFile(path.join(currentDirectory, reportFile), resolve, reject)
      })
  })
}
