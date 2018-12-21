// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const { getAnnotation } = require('./bandit_annotations')
const { countIssueLevels } = require('../annotations_levels')

/**
 * @param {*} issues the issues found by Bandit
 */
function createMoreInfoLinks (issues) {
  let issuesMap = new Map()
  let moreInfo = 'For more information about the issues follow the links: \n'

  for (let issue of issues) {
    if (issuesMap.has(issue.test_id) === false) {
      issuesMap.set(issue.test_id)
      const text = `${issue.test_id}:${issue.test_name}`
      moreInfo += `[${text}](${issue.more_info})\n`
    }
  }
  return moreInfo
}

/**
 * Convert bandit output into valid 'output' object for check run conclusion
 * @param {any} results Bandit json output
 */
module.exports = (results) => {
  let title = ''
  let summary = ''
  let annotations = []
  let moreInfo = ''

  if (results && results.results.length !== 0) {
    title = config.issuesFoundResultTitle
    annotations = results.results.map(issue => getAnnotation(issue))
    summary = countIssueLevels(annotations)
    moreInfo = createMoreInfoLinks(results.results)
  } else {
    title = config.noIssuesResultTitle
    summary = config.noIssuesResultSummary
  }
  return { title, summary, annotations, moreInfo }
}
