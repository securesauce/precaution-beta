// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const path = require('path')
const parse = require('../parse_output');

const cache = require('../cache')
const config = require('../config')

/**
 * @param {string} directory Working directory for Bandit process
 * @param {string[]} inputFiles List of input file paths relative to working directory
 * @param {string?} params.reportFile Path to report file relative to working directory (default: bandit.json)
 * @param {string?} params.baselineFile Path to baseline file relative to working directory
 * @returns {Promise} results json
 */
function runBandit (directory, inputFiles, params) {
  params = params || {}
  params.reportFile = params.reportFile || 'bandit.json'

  const reportPath = path.join(directory, params.reportFile)

  let banditArgs = [...inputFiles, '--format', 'json', '-o', params.reportFile]
  if (params.baselineFile) {
    banditArgs.push('--baseline', params.baselineFile)
  }

  const banditProcess = spawn('bandit', banditArgs, { cwd: directory })

  return new Promise((resolve, reject) => {
    banditProcess
      .on('error', reject)
      .on('close', () => {
        parse.readFile(resolve, reject, reportPath)  
      })
  })
}


/**
 * Spawn a bandit process analyzing all given files in provided directory
 * @param {Object} PR information about the pull request
 * @param {String[]} inputFiles List of input file paths relative to working directory
 * @returns {Object} results from the bandit scan
 */
module.exports = async function (PR, inputFiles) {

  let banditResults
  if (config.compareAgainstBaseline) {
    const baselineFile = '../baseline.json'
    // Run baseline scan on PR base
    await runBandit(cache.getBranchPath(PR.id, 'base', "bandit"), inputFiles, { reportFile: baselineFile})
    banditResults = await runBandit(cache.getBranchPath(PR.id, 'head', "bandit"), inputFiles, { baselineFile })
  } 
  else {
    banditResults = await runBandit(cache.getBranchPath(PR.id, 'head', "bandit"), inputFiles)
  }

  return banditResults
}