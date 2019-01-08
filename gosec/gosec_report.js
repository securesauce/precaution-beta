// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const { getAnnotation } = require('./gosec_annotations')
const { countIssueLevels } = require('../annotations_levels')

/**
 *
 * @param {*} results results gosec json output
 * @param {*} directory working directory for Gosec process
 */
module.exports = (results, directory) => {
  let title = ''
  let summary = ''
  let annotations = []

  if (results && results.Issues.length !== 0) {
    title = config.issuesFoundResultTitle
    annotations = results.Issues.map(issue => getAnnotation(issue, directory))
    summary = countIssueLevels(annotations)
  } else {
    title = config.noIssuesResultTitle
    summary = config.noIssuesResultSummary
  }

  return { title, summary, annotations }
}
