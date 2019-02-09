// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotations } = require('./eslint_plugin_annotations')
const { countIssueLevels } = require('../annotations_levels')

/**
 * Process Eslint plugin output (generate annotations, count issue levels)
 * @param {*} results Eslint plugin json output
 */
module.exports = (results) => {
  // The structure of the ESlint JSON output is that
  // the issues found by ESLint are grouped by files.
  // In the ESlint output there are files without any problems
  // and that's why I have to filter them.
  const filesWithIssues = results.filter((fileWithIssues) => fileWithIssues.messages.length !== 0)
  let annotations = []
  for (let i = 0; i < filesWithIssues.length; ++i) {
    annotations = annotations.concat(getAnnotations(filesWithIssues[i]))
  }

  const issueCount = countIssueLevels(annotations)
  const moreInfo = ''

  return { annotations, issueCount, moreInfo }
}
