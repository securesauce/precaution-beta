const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

function parseJSON (data) {
  try {
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

/**
 * Spawn a bandit process analyzing all given files in provided directory
 * @param {string} directory Working directory for Bandit process
 * @param {string[]} inputFiles List of input file paths relative to working directory
 * @param {string?} params.reportFile Path to report file relative to working directory (default: bandit.json)
 * @param {string?} params.baselineFile Path to baseline file relative to working directory
 * @returns {Promise} results json
 */
module.exports = (directory, inputFiles, params) => {
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
        fs.readFile(reportPath, 'utf8', (err, data) => {
          if (err) return reject(err)

          const results = parseJSON(data)
          resolve(results)
        })
      })
  })
}
