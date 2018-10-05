const runBandit = require('./bandit')
const generateOutput = require('./report')
const cache = require('./cache')

const config = require('./config')

const rawMediaType = 'application/vnd.github.v3.raw'

/**
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {

  app.log('Starting app')

  app.on('check_suite', async context => {
    const {action, check_suite} = context.payload
    const head_sha = check_suite.head_sha

    // Check suite is requested when code is pushed to the repository
    // TODO: investigate GitHub editor not triggering check suite
    if (action === 'requested') {
      // Commit was pushed to a PR branch
      if (check_suite.pull_requests.length > 0) {
        await runLinterFromPRData(check_suite.pull_requests, context, head_sha)
      }

      // Ignore push events not linked to a pull request
    }
    // Check suite was manually rerequested by a user on the checks dashboard
    // (previous run didn't complete)
    else if (action === 'rerequested') {
      await runLinterFromPRData(check_suite.pull_requests, context, head_sha)
    }
  })

  // Same thing but have to intercept the event because check suite is not triggered
  app.on('pull_request.opened', async context => {
    const {number, pull_request} = context.payload
    const head_sha = pull_request.head.sha

    await runLinterFromPRData([pull_request], context, head_sha)
  })
}

/**
 * Retrive files modified by pull request(s), run linter and send results
 * @param {any[]} pull_requests
 * @param {import('probot').Context} context
 * @param {string} head_sha
 */
async function runLinterFromPRData (pull_requests, context, head_sha) {
  const {owner, repo} = context.repo()

  // Create the check run
  const started_at = new Date().toISOString()
  const createCheckRunResponse = context.github.checks.create({owner,
    repo,
    name: 'security-linter',
    head_sha,
    status: 'in_progress',
    started_at
  })

  try {
    // Process all pull requests associated with check suite
    const PRsDownloadedPromise = pull_requests.map(pr => processPullRequest(pr, context))
    const resolvedPRs = await Promise.all(PRsDownloadedPromise)

    // For now only deal with one PR
    const PR = pull_requests[0]
    const files = resolvedPRs[0]
    let results

    if (config.compareAgainstBaseline) {
      const baselineFile = '../baseline.json'
      // Run baseline scan on PR base
      await runBandit(cache.getBranchPath(PR.id, 'base'), files, { reportFile: baselineFile})
      results = await runBandit(cache.getBranchPath(PR.id, 'head'), files, { baselineFile })
    } else {
      results = await runBandit(cache.getBranchPath(PR.id, 'head'), files)
    }

    const output = generateOutput(results, cache.getBranchPath(PR.id, 'head'))
    const completed_at = new Date().toISOString()

    // Send results using the octokit API
    const check_run_id = (await createCheckRunResponse).data.id
    await context.github.checks.update({check_run_id,
      owner,
      repo,
      status: 'completed',
      completed_at,
      conclusion: 'success',
      output})

    if (config.cleanupAfterRun)
      cache.clear(PR.id)
  } catch (err) {
    // context.log.error(err)

    // Send error to GitHub
    const completed_at = new Date().toISOString()
    const check_run_id = (await createCheckRunResponse).data.id
    context.github.checks.update({check_run_id,
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
}

/**
 * Retrieve list of files modified by PR and download them to cache
 * @param {import('probot').Context} context
 * @returns {Promise<string[]>}
 */
async function processPullRequest (pull_request, context) {
  const {owner, repo} = context.repo()
  const number = pull_request.number
  const ref = pull_request.head.ref
  const baseRef = pull_request.base.ref
  const id = pull_request.id

  // See https://developer.github.com/v3/pulls/#list-pull-requests-files
  // TODO: Support pagination for >30 files (max 300)
  const response = await context.github.pullRequests.getFiles({owner, repo, number})

  const filesDownloadedPromise = response.data
    .filter(file => config.fileExtensions.reduce((acc, ext) => acc || file.filename.endsWith(ext), false))
    .map(async fileJSON => {
      const filename = fileJSON.filename

      // See https://developer.github.com/v3/repos/contents/#get-contents
      const response = await context.github.repos.getContent({owner, repo, path: filename, ref,
        headers: {accept: rawMediaType}})
      cache.saveFile(id, 'head', filename, response.data)

      if (config.compareAgainstBaseline) {
        const baseFileResp = await context.github.repos.getContent({owner, repo, path: filename, ref: baseRef,
          headers: {accept: rawMediaType}})
        cache.saveFile(id, 'base', filename, baseFileResp.data)
      }

      return filename
    })

    // Wait until all files have been downloaded
    const filenames = await Promise.all(filesDownloadedPromise)
    return filenames
}
