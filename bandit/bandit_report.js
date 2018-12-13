// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const { getAnnotation } = require('./bandit_annotations')
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
 * Convert bandit output into valid 'output' object for check run conclusion
 * @param {any} results Bandit json output
 */
module.exports = (results) => {
  let title, summary, annotations

  if (results && results.results.length !== 0) {
    title = config.issuesFoundResultTitle
    annotations = results.results.map(issue => getAnnotation(issue))

    summary = customSummary(annotations)
  } else {
    title = config.noIssuesResultTitle
    summary = config.noIssuesResultSummary
  }
  return { title, summary, annotations }
}
