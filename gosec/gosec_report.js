// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const { getAnnotation } = require('./gosec_annotations')
const { countIssueLevels } = require('../annotations_levels')

function customSummary (annotations) {
  const { errors, warnings, notices } = countIssueLevels(annotations)

  const summary = {
    'errors': errors,
    'warnings': warnings,
    'notices': notices
  }
  return summary
}

/**
 *
 * @param {*} results results gosec json output
 * @param {*} directory working directory for Gosec process
 */
module.exports = (results, directory) => {
  let title, summary, annotations
  if (results && results.Issues.length !== 0) {
    title = config.issuesFoundResultTitle
    annotations = results.Issues.map(issue => getAnnotation(issue))
    summary = customSummary(annotations)
  } else {
    title = config.noIssuesResultTitle
    summary = config.noIssuesResultSummary
  }

  return { title, summary, annotations }
}
