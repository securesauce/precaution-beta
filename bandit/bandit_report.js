// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

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
 * Process Bandit output (generate annotations, count issue levels)
 * @param {any} results Bandit json output
 */
module.exports = (results) => {
  const annotations = results.results.map(issue => getAnnotation(issue))
  const issueCount = countIssueLevels(annotations)
  const moreInfo = annotations.length > 0 ? createMoreInfoLinks(results.results) : ''

  return { annotations, issueCount, moreInfo }
}
