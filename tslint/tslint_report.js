// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotation } = require('./tslint_annotations')
const { countIssueLevels } = require('../annotations_levels')

/**
 * Process TSLint output (generate annotations, count issue levels)
 * @param {*} results TSLint json output
 */
module.exports = (results) => {
  const annotations = results.map(issue => getAnnotation(issue))
  const issueCount = countIssueLevels(annotations)
  const moreInfo = ''

  return { annotations, issueCount, moreInfo }
}
