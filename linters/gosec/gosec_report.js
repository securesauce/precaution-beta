// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotation } = require('./gosec_annotations')
const { countIssueLevels } = require('../../annotations_levels')

/**
 * Process Gosec output (generate annotations, count issue levels)
 * @param {*} results Gosec json output
 * @param {*} directory working directory for Gosec process
 */
module.exports = (results, directory) => {
  const annotations = results.Issues.map(issue => getAnnotation(issue, directory))
  const issueCount = countIssueLevels(annotations)
  const moreInfo = ''

  return { annotations, issueCount, moreInfo }
}
