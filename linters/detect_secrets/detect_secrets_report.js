// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotation } = require('./detect_secrets_annotations')
const { countIssueLevels } = require('../../annotations_levels')

/**
 * Process detect-secrets output (generate annotations, count issue levels)
 * @param {*} results detect-secrets json output
 * @returns {{{Object[]}, Object, String}} Object[] array of annotation objects
 * see https://developer.github.com/v3/checks/runs/#annotations-object
 * Object contains the number of errors, warnings and notices found
 * String consists of link|links to the documentation for the issues
 */
module.exports = (results) => {
  const filesWithIssues = Object.keys(results)
  let annotations = []
  for (let file of filesWithIssues) {
    for (let issue of results[file]) {
      annotations.push(getAnnotation(issue, file))
    }
  }
  const issueCount = countIssueLevels(annotations)
  let moreInfo = ''
  if (annotations.length > 0) {
    moreInfo = '[detect-secrets documentation](https://github.com/Yelp/detect-secrets#currently-supported-plugins)'
  }
  return { annotations, issueCount, moreInfo }
}
