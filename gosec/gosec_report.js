// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const { getAnnotation } = require('./gosec_annotations')

/**
 * Convert gosec json output into valid 'output' object for check run conclusion
 * @param {any} results gosec json output
 */
module.exports = (results) => {
  let title, summary, annotations

  if (results && results.Issues.length !== 0) {
    title = config.issuesFoundResultTitle
    summary = JSON.stringify(results.Stats || 'N/A', null, '\n')
    annotations = results.Issues.map(issue => getAnnotation(issue))
  } else {
    title = config.noIssuesResultTitle
    summary = config.noIssuesGosecResultSummary
  }

  return { title, summary, annotations }
}
