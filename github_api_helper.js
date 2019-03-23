// Copyright 2019 VMware, Inc.
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
 * Filters the listed files and returns only the files relevant to us
 * @param {*} rawData the raw output from list files API call
 * @return {Promise[]<any>} the filtered GitHub response
 */
function filterData (rawData) {
  return rawData.data.filter(file => config.fileExtensions.reduce((acc, ext) => acc || file.filename.endsWith(ext), false))
    .filter(fileJSON => fileJSON.status !== 'removed').map(async fileInfo => {
      return fileInfo.filename
    })
}

/**
 * Get list of files modified by a pull request
 * @param {import('probot').Context} context Probot context
 * @param {number} number the pull request number inside the repository
 * @returns {String[]} paths to the diff files from the pull request relevant to us
 */
async function getPRFiles (context, number) {
  const { owner, repo } = context.repo()

  // See https://developer.github.com/v3/pulls/#list-pull-requests-files
  let response = await context.github.pullRequests.listFiles({
    owner: owner,
    repo: repo,
    number: number,
    per_page: config.numFilesPerPage
  })

  let data = filterData(response)
  while (context.github.hasNextPage(response)) {
    response = await context.github.getNextPage(response)
    data = data.concat(filterData(response))
  }
  return Promise.all(data)
}

/**
 * Get file contents as raw data
 * @param {import('probot').Context} context Probot context
 * @param {string} path file path relative to repository root
 * @param {string} ref sha of file revision
 * @param {pull_request.head?} head Reference to the fork the commit originated from
 * @returns {Promise<any>} GitHub response
 * See https://developer.github.com/v3/repos/contents/#get-contents
 */
function getRawFileContents (context, path, ref, head) {
  let { owner, repo } = context.repo()
  // This check is necessary in the case when there is a pr
  // which is not from forked repository.
  // Then the repo and owner fields are not in the head object
  if (head.user) {
    owner = head.user.login
    repo = head.repo.name
  }

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
    for (let annotation of annotations) {
      if (annotation.annotation_level === 'failure') {
        conclusion = 'failure'
        break
      } else if (annotation.annotation_level === 'warning') {
        conclusion = 'neutral'
      }
    }
  }

  return conclusion
}

/**
 * Send check run results
 * @param {import('probot').Context} context Probot context
 * @param {Number} runID check run identifier
 * @param {Object} output merged scan output
 * @param {Number} annotationsPerPage Optional: number of annotations to send with one API call.
 * @returns {Promise<any>} GitHub response
 * See: https://developer.github.com/v3/checks/runs/#update-a-check-run
 */
function sendResults (context, runID, output, annotationsPerPage) {
  const { owner, repo } = context.repo()
  let numAnnotationsLeftToSend = output.annotations.length
  const MAX_ANNOTATIONS_CALL = 50

  let numAnnotationsPerAPICall = annotationsPerPage || config.numAnnotationsPerUpdate
  if (numAnnotationsPerAPICall <= 0 || numAnnotationsPerAPICall > MAX_ANNOTATIONS_CALL) {
    numAnnotationsPerAPICall = config.numAnnotationsPerUpdate
  }

  let numberOfAPIcalls = Math.ceil(numAnnotationsLeftToSend / numAnnotationsPerAPICall)
  numberOfAPIcalls = numberOfAPIcalls === 0 ? 1 : numberOfAPIcalls

  let startIndex = 0
  let endIdex = numAnnotationsPerAPICall

  for (let i = 0; i < numberOfAPIcalls; ++i) {
    if (numAnnotationsLeftToSend < config.numAnnotationsPerUpdate) {
      endIdex = output.annotations.length
    }

    const completedAt = new Date().toISOString()
    context.github.checks.update({
      check_run_id: runID,
      owner,
      repo,
      status: 'completed',
      completed_at: completedAt,
      conclusion: getConclusion(output.annotations),
      output: {
        title: output.title,
        summary: output.summary,
        text: output.text,
        annotations: output.annotations.slice(startIndex, endIdex)
      }
    })

    startIndex += numAnnotationsPerAPICall
    endIdex += numAnnotationsPerAPICall
    numAnnotationsLeftToSend -= endIdex - startIndex
  }
}

/**
 * Sends check run error conclusion
 * @param {import('probot').Context} context Probot context
 * @param {Number} runId check run identifier
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
