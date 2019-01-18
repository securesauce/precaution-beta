// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const cache = require('./cache')
const { config } = require('./config')
const apiHelper = require('./github_api_helper')
const { runLinters } = require('./runner')

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

  app.on('check_run', async context => {
    const action = context.payload.action
    const headSha = context.payload.check_run.head_sha
    const pullRequests = context.payload.check_run.pull_requests
    if (action === 'rerequested') {
      // Check suite was manually rerequested by a user on the checks dashboard
      await runLinterFromPRData(pullRequests, context, headSha)
    }
  })

  app.on(['pull_request.opened', 'pull_request.reopened', 'pull_request.synchronize'], async context => {
    // Same thing but have to intercept the event because check suite is not triggered
    const pullRequest = context.payload.pull_request
    const headSha = pullRequest.head.sha
    await runLinterFromPRData([pullRequest], context, headSha)
  })
}

/**
 * Retrieve files modified by pull request(s), run linter and send results
 * @param {any[]} pullRequests object which contains information about the pull request
 * @param {import('probot').Context} context
 * @param {string} headSha
 */
async function runLinterFromPRData (pullRequests, context, headSha) {
  const repoID = context.payload.repository.id

  // Create check run on GitHub to send early feedback
  const checkRunResponse = apiHelper.inProgressAPIresponse(context, headSha)

  try {
    // Process all pull requests associated with check suite
    const PRsDownloadedPromise = pullRequests.map(pr => processPullRequest(pr, context))
    const resolvedPRs = await Promise.all(PRsDownloadedPromise)

    // For now only deal with one PR
    const PR = pullRequests[0]
    const inputFiles = resolvedPRs[0]

    const report = await runLinters(inputFiles, repoID, PR.id)

    const runID = (await checkRunResponse).data.id
    apiHelper.sendResults(context, runID, report)

    if (config.cleanupAfterRun) {
      cache.clear(repoID, PR.id)
    }
  } catch (err) {
    context.log.error(err)
    const resolvedCheckRunResponse = await checkRunResponse
    const runID = resolvedCheckRunResponse.data.id
    // Send error to GitHub
    apiHelper.errorResponse(context, runID, err)
  }
}

/**
 * Retrieve list of files modified by PR and download them to cache
 * @param {import('probot').Context} context
 * @returns {Promise<string[]>} Paths to the downloaded PR files
 */
async function processPullRequest (pullRequest, context) {
  const number = pullRequest.number
  const ref = pullRequest.head.ref
  const id = pullRequest.id
  const repoID = context.payload.repository.id

  // TODO: Support pagination for >30 files (max 300)
  const response = await apiHelper.getPRFiles(context, number)

  const filesDownloadedPromise = response.data
    .filter(file => config.fileExtensions.reduce((acc, ext) => acc || file.filename.endsWith(ext), false))
    .filter(async fileJSON => fileJSON !== 'deleted')
    .map(async fileJSON => {
      const filename = fileJSON.filename

      const headRevision = apiHelper.getContents(context, filename, ref, pullRequest.head)

      // TODO: merge this code with linter-specific path resolution
      if (filename.endsWith('.py')) {
        cache.saveFile(repoID, id, filename, (await headRevision).data, 'python')
      } else if (filename.endsWith('.go')) {
        cache.saveFile(repoID, id, filename, (await headRevision).data, 'go')
      }

      return filename
    })

  // Wait until all files have been downloaded
  return Promise.all(filesDownloadedPromise)
}
