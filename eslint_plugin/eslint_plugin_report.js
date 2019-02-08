// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotations } = require('./eslint_plugin_annotations')
const { countIssueLevels } = require('../annotations_levels')

/**
 * Process Eslint plugin output (generate annotations, count issue levels)
 * @param {*} results Eslint plugin json output
 */
module.exports = (results) => {
  // The structure of the ESlint JSON output is that the issues are grouped by files.
  // Also, the ESlint plugin gives output for every single file even though some of the files
  // can be secure and we have to filter those files.
  const filesWithIssues = results.filter((fileWithIssues) => fileWithIssues.messages.length !== 0)
  let annotations = []
  for (let i = 0; i < filesWithIssues.length; ++i) {
    annotations = annotations.concat(getAnnotations(filesWithIssues[i]))
  }

  const issueCount = countIssueLevels(annotations)
  const moreInfo = ''

  return { annotations, issueCount, moreInfo }
}
