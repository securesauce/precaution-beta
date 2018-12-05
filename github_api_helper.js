// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('./config')

const rawMediaType = 'application/vnd.github.v3.raw'

/**
 * Create a check run with status in progress and sends it to Github
 * @param {import('probot').Context} context Probot context
 * @param {String} headSha sha of the commit
 * @return {Promise<any>}
 * See https://developer.github.com/v3/checks/runs/#create-a-check-run
 */
function inProgressAPIresponse (context, headSha) {
  const { owner, repo } = context.repo()
  const startedAt = new Date().toISOString()

  return context.github.checks.create({
    owner,
    repo,
    name: config.checkRunName,
    head_sha: headSha,
    status: 'in_progress',
    started_at: startedAt
  })
}

/**
 * Get list of files modified by a pull request
 * @param {import('probot').Context} context Probot context
 * @param {number} number the pull request number inside the repository
 * @returns {Promise<any>} GitHub response
 * See https://developer.github.com/v3/pulls/#list-pull-requests-files
 */
function getPRFiles (context, number) {
  const { owner, repo } = context.repo()

  return context.github.pullRequests.listFiles({
    owner,
    repo,
    number
  })
}

/**
 * Get file contents as raw data
 * @param {import('probot').Context} context Probot context
 * @param {string} path file path relative to repository root
 * @param {string} ref sha of file revision
 * @returns {Promise<any>} GitHub response
 * See https://developer.github.com/v3/repos/contents/#get-contents
 */
function getRawFileContents (context, path, ref) {
  const { owner, repo } = context.repo()

  return context.github.repos.getContents({
    owner,
    repo,
    path,
    ref,
    headers: { accept: rawMediaType }
  })
}

/**
 * @param {Object[]} annotations see: https://developer.github.com/v3/checks/runs/#annotations-object-1
 * @returns {String} the conclusion of the check run
 * see possible conclusions on: https://developer.github.com/v3/checks/runs/#parameters-1
 */
function getConclusion (annotations) {
  let conclusion = 'success'

  if (annotations) {
    for (let i = 0; i < annotations.length; ++i) {
      if (annotations[i].annotation_level === 'failure') {
        conclusion = 'failure'
        break
      } else if (annotations[i].annotation_level === 'warning') {
        conclusion = 'neutral'
      }
    }
  }

  return conclusion
}

/**
 * Send check run results
 * @param {import('probot').Context} context Probot context
 * @param {Number} runID chek run identifier
 * @param {Object} output output from the scan of Gosec and Bandit
 * @returns {Promise<any>} GitHub response
 * See: https://developer.github.com/v3/checks/runs/#update-a-check-run
 */
function sendResults (context, runID, output) {
  const { owner, repo } = context.repo()
  const completedAt = new Date().toISOString()

  return context.github.checks.update({
    check_run_id: runID,
    owner,
    repo,
    status: 'completed',
    completed_at: completedAt,
    conclusion: getConclusion(output.annotations),
    output
  })
}

/**
 * Sends check run error conclusion
 * @param {import('probot').Context} context Probot context
 * @param {Number} runId chek run identifier
 * @param {Error} err the error which occurs and stops the program
 * @returns {Promise<any>} GitHub response
 * See: https://developer.github.com/v3/checks/runs/#update-a-check-run
 */
function errorResponse (context, runID, err) {
  const { owner, repo } = context.repo()
  const completedAt = new Date().toISOString()

  return context.github.checks.update({
    check_run_id: runID,
    owner,
    repo,
    status: 'completed',
    completed_at: completedAt,
    conclusion: 'failure',
    output: {
      title: 'App error',
      summary: String(err)
    }
  })
}

module.exports.inProgressAPIresponse = inProgressAPIresponse
module.exports.errorResponse = errorResponse
module.exports.getPRFiles = getPRFiles
module.exports.getContents = getRawFileContents
module.exports.sendResults = sendResults
module.exports.getConclusion = getConclusion
