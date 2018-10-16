// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const generateOutput = require('./bandit/bandit_report')

const cache = require('./cache')
const apiHelper = require('./github_api_helper')
const runBandit = require('./bandit/bandit')

const config = require('./config')

const rawMediaType = 'application/vnd.github.v3.raw'

/**
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.log('Starting app')

  app.on('check_suite', async context => {
    const action = context.payload.action
    const checkSuite = context.payload.check_suite
    const headSha = checkSuite.head_sha
    const pullRequests = checkSuite.pull_requests

    if (action === 'requested') {
      // Check suite is requested when code is pushed to the repository
      // TODO: investigate GitHub editor not triggering check suite
      if (pullRequests.length > 0) {
        // Commit was pushed to a PR branch
        await runLinterFromPRData(pullRequests, context, headSha)
      }

      // Ignore push events not linked to a pull request
    } else if (action === 'rerequested') {
      // Check suite was manually rerequested by a user on the checks dashboard
      // (previous run didn't complete)
      await runLinterFromPRData(pullRequests, context, headSha)
    }
  })

  app.on('pull_request.opened', async context => {
    const { pull_request } = context.payload
    const headSha = pull_request.head.sha

    await runLinterFromPRData([pull_request], context, headSha)
  })
}

/**
 * Retrive files modified by pull request(s), run linter and send results
 * @param {any[]} pullRequests
 * @param {import('probot').Context} context
 * @param {string} headSha
 */
async function runLinterFromPRData (pullRequests, context, headSha) {
  const { owner, repo } = context.repo()

  // Send in progress status to Github
  const checkRunResponse = apiHelper.inProgressAPIresponse(owner, repo, headSha, context)
 
  let PRid = -1
  try {
    // Process all pull requests associated with check suite
    const PRsDownloadedPromise = pullRequests.map(pr => processPullRequest(pr, context))
    const resolvedPRs = await Promise.all(PRsDownloadedPromise)

    // I need to know if there are any Python files
    // because of the analyze Bandit
    const { filenames, existingPythonFiles } = resolvedPRs[0]
    
    // For now only deal with one PR
    const PR = pullRequests[0]

    let banditResults
    if(existingPythonFiles){
      banditResults = await runBandit(PR, filenames)
    }

    let output = generateOutput(banditResults)

    apiHelper.sendResults(owner, repo, checkRunResponse, context, output)
    if (config.cleanupAfterRun)
      cache.clear(PR.id)

  } catch (err) {
    
    // clean cache files when there is an error
    if (PRid !== -1 && config.cleanupAfterRun)
      cache.clear(PRid)

    // Send error to GitHub
    apiHelper.errorResponse(checkRunResponse, owner, repo, context, err)
  }
}

/**
 * Retrieve list of files modified by PR and download them to cache
 * @param {import('probot').Context} context
 * @returns {Promise<string[]>} Paths to the downloaded PR files
 */
async function processPullRequest (pullRequest, context) {
  const { owner, repo } = context.repo()
  const number = pullRequest.number
  const ref = pullRequest.head.ref
  const baseRef = pullRequest.base.ref
  const id = pullRequest.id

  let existingPythonFiles = false

  // See https://developer.github.com/v3/pulls/#list-pull-requests-files
  // TODO: Support pagination for >30 files (max 300)
  const response = await context.github.pullRequests.getFiles({ owner, repo, number })

  const filesDownloadedPromise = response.data
    .filter(file => config.fileExtensions.reduce((acc, ext) => acc || file.filename.endsWith(ext), false))
    .map(async fileJSON => {
      const filename = fileJSON.filename

      // See https://developer.github.com/v3/repos/contents/#get-contents
      const response = await context.github.repos.getContent({ owner,
        repo,
        path: filename,
        ref,
        headers: { accept: rawMediaType } })
      cache.saveFile(id, 'head', filename, response.data)

      if (existingPythonFiles === false && filename.endsWith('.py')) {
        existingPythonFiles = true
      }

      if (config.compareAgainstBaseline) {
        const baseFileResp = await context.github.repos.getContent({ owner,
          repo,
          path: filename,
          ref: baseRef,
          headers: { accept: rawMediaType } })
        cache.saveFile(id, 'base', filename, baseFileResp.data)
      }

      return filename
    })

    // Wait until all files have been downloaded
    // Without the await existingBandit files is not initialize properly
    const filenames = await Promise.all(filesDownloadedPromise)

    return { filenames, existingPythonFiles }
}
