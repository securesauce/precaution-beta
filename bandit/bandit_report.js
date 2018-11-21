// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const { getAnnotation } = require('./bandit_annotations')

function customSummary (banditSummary) {
  let severityHigh = banditSummary['SEVERITY.HIGH']
  let severityMedium = banditSummary['SEVERITY.MEDIUM']
  let severityLow = banditSummary['SEVERITY.LOW']

  const summary = {
    'SEVERITY_HIGH': severityHigh,
    'SEVERITY_MEDIUM': severityMedium,
    'SEVERITY_LOW': severityLow
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
    let severityInfo = customSummary(results.metrics._totals)
    // Temporary output before the final pull request which will combine the
    // the output for Gosec and Bandit is merged into master
    summary = 'SEVERITY_HIGH: ' + severityInfo.SEVERITY_HIGH + '\n'
    summary += 'SEVERITY_MEDIUM: ' + severityInfo.SEVERITY_MEDIUM + '\n'
    summary += 'SEVERITY_LOW: ' + severityInfo.SEVERITY_LOW + '\n'

    annotations = results.results.map(issue => getAnnotation(issue))
  } else {
    title = config.noIssuesResultTitle
    summary = config.noIssuesResultSummary
  }
  return { title, summary, annotations }
}
