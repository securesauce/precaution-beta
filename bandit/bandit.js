// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const path = require('path')
const parseOutput = require('../parse_output')
const fs = require('fs')

/**
 * Spawn a bandit process analyzing all given files in provided directory
 * @param {string} directory Working directory for Bandit process
 * @param {string[]} inputFiles List of input file paths relative to working directory
 * @param {string?} params.reportFile Path to report file relative to working directory (default: bandit.json)
 * @param {string?} params.baselineFile Path to baseline file relative to working directory
 * @returns {Promise} results json
 */
module.exports = (directory, inputFiles, params) => {
  const pyFiles = inputFiles.filter(fileName => fileName.endsWith('.py'))
  if (pyFiles.length === 0) {
    return null
  }

  params = params || {}
  params.reportFile = params.reportFile || 'bandit.json'

  const reportPath = path.join(directory, params.reportFile)

  let banditArgs = [...pyFiles, '--format', 'json', '-o', params.reportFile]

  if (fs.existsSync(path.resolve('.bandit'))) {
    banditArgs.push('-c', path.resolve('.bandit'))
  }

  if (params.baselineFile) {
    banditArgs.push('--baseline', params.baselineFile)
  }

  const banditProcess = spawn('bandit', banditArgs, { cwd: directory })

  return new Promise((resolve, reject) => {
    banditProcess
      .on('error', reject)
      .on('close', () => {
        parseOutput.readFile(reportPath, resolve, reject)
      })
  })
}
