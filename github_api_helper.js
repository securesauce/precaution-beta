// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

/**
 * Create a check run with status in progress and sends it to Github
 * @param {String} owner owner of the repository
 * @param {String} repo the repository name
 * @param {String} headSha sha of the commit
 * @param {import('probot').Context} context of the pull request
 * see https://probot.github.io/api/latest/classes/context.html
 * @return {{Promise<any>}} see https://developer.github.com/v3/checks/runs/#response
 */
function inProgressAPIresponse (owner, repo, headSha, context) {
  // Create the check run
  const startedAt = new Date().toISOString()
  return context.github.checks.create({
    owner,
    repo,
    name: 'Frisk security linter',
    head_sha: headSha,
    status: 'in_progress',
    started_at: startedAt
  })
}

/**
 * Sends error conclusion with a message to Github
 * @param {String} owner owner of the repository
 * @param {String} repo the repository
 * @param {import('probot').Context} context context of the pull request; see https://probot.github.io/api/latest/classes/context.html
 * @param {Number} runId positive number for the chek run ID
 * @param {Error} err the error which occurs and stops the program
 * @returns {{Promise<any>}} see https://developer.github.com/v3/checks/runs/#response-2
 */
async function errorResponse (owner, repo, context, runID, err) {
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

/**
 * Send results using the octokit API
 * @param {String} owner owner of the repository
 * @param {String} repo the repository
 * @param {Number} runID positive number for the chek run ID
 * @param {import('probot').Context} context context of the pull request; see https://probot.github.io/api/latest/classes/context.html
 * @param {Object} output output from the scan of Gosec and Bandit
 * @returns {{Promise<any>}} see https://developer.github.com/v3/checks/runs/#response-2
 * see: https://developer.github.com/v3/checks/runs/#output-object-1
 */
async function sendResults (owner, repo, runID, context, output) {
  const completedAt = new Date().toISOString()
  return context.github.checks.update({
    check_run_id: runID,
    owner,
    repo,
    status: 'completed',
    completed_at: completedAt,
    conclusion: 'success',
    output
  })
}

module.exports.inProgressAPIresponse = inProgressAPIresponse
module.exports.errorResponse = errorResponse
module.exports.sendResults = sendResults
