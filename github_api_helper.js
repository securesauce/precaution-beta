// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

/**
 * Create a check run with status in progress and sends it to Github
 * @param {String} owner owner of the repository
 * @param {String} repo the repository name
 * @param {String} head_sha sha of the commit
 */
function inProgressAPIresponse(owner, repo, head_sha, context) {

   // Create the check run
  const started_at = new Date().toISOString()
  const checkRunResponse = context.github.checks.create({
    owner,
    repo,
    name: 'security-linter',
    head_sha,
    status: 'in_progress',
    started_at
  })

   return checkRunResponse
}

/**
 * Sends error conclusion with a message to Github
 * @param {Promise<Object>} checkRunResponse see https://developer.github.com/v3/checks/runs/#response-2
 * @param {String} owner owner of the repository
 * @param {String} repo the repository
 * @param {Object} context context of the pull request; see https://probot.github.io/api/latest/classes/context.html
 * @param {Error} err the error which occurs and stops the program 
 */
async function errorResponse(checkRunResponse, owner, repo, context, err) {

  const resolvedErroResponse = await checkRunResponse
  const completed_at = new Date().toISOString()

  const check_run_id = resolvedErroResponse.data.id
  context.github.checks.update({
    check_run_id,
    owner,
    repo,
    status: 'completed',
    completed_at,
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
 * @param {Promise<Object>} checkRunResponse see https://developer.github.com/v3/checks/runs/#response-2
 * @param {Object} context context of the pull request; see https://probot.github.io/api/latest/classes/context.html
 * @param {Object} output output from the scan of Gosec and Bandit
 * see: https://developer.github.com/v3/checks/runs/#output-object-1
 */
async function sendResults(owner, repo, checkRunResponse, context, output) {

  const completed_at = new Date().toISOString()

  const resolvedCheckRunResponse = await checkRunResponse

  const check_run_id = resolvedCheckRunResponse.data.id
  await context.github.checks.update({
    check_run_id,
    owner,
    repo,
    status: 'completed',
    completed_at,
    conclusion: 'success',
    output})
}


module.exports.sendResults = sendResults
module.exports.inProgressAPIresponse = inProgressAPIresponse
module.exports.errorResponse = errorResponse
