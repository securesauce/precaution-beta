// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const annotation = require('./bandit_annotations')

/**
 * Convert bandit output into valid 'output' object for check run conclusion
 * @param {any} results Bandit json output
 */
module.exports = (results) => {
  let title, summary, annotations

  if (results && results.results.length !== 0) {
    title = config.issuesFoundResultTitle
    summary = JSON.stringify(results.metrics || 'N/A', null, '\n')
    annotations = results.results.map(issue => annotation.getAnnotation(issue))
  } else {
    title = config.noIssuesResultTitle
    summary = config.noIssuesBanditResultSummary
  }

  return { title, summary, annotations }
}
