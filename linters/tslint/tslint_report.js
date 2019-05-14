// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotation } = require('./tslint_annotations')
const { countIssueLevels } = require('../../annotations_levels')
const { config } = require('../../config')

/**
 * @param {*} issues the issues found by TSLint
 */
function createMoreInfoLinks (issues) {
  let issuesMap = new Map()
  let moreInfo = ''

  for (let issue of issues) {
    if (issuesMap.has(issue.ruleName) === false) {
      issuesMap.set(issue.ruleName)
      const linkToDoc = config.tslintProjectWebsite + '#' + issue.ruleName
      moreInfo += `[${issue.ruleName}](${linkToDoc})\n`
    }
  }
  return moreInfo
}

/**
 * Process TSLint output (generate annotations, count issue levels)
 * @param {*} results TSLint json output
 * @returns {Object {Object[], Object, String}}
 */
module.exports = (results) => {
  const annotations = results.map(issue => getAnnotation(issue))
  const issueCount = countIssueLevels(annotations)
  const moreInfo = annotations.length > 0 ? createMoreInfoLinks(results) : ''

  return { annotations, issueCount, moreInfo }
}
