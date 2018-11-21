// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('./config')

function mergeSummaries (banditSummary, gosecSummary) {
  let severityHigh, severityMedium, severityLow

  if (banditSummary === config.noIssuesResultSummary) {
    severityHigh = gosecSummary.SEVERITY_HIGH
    severityMedium = gosecSummary.SEVERITY_MEDIUM
    severityLow = gosecSummary.SEVERITY_LOW
  } else if (gosecSummary === config.noIssuesResultSummary) {
    severityHigh = banditSummary.SEVERITY_HIGH
    severityMedium = banditSummary.SEVERITY_MEDIUM
    severityLow = banditSummary.SEVERITY_LOW
  } else {
    severityHigh = banditSummary.SEVERITY_HIGH + gosecSummary.SEVERITY_HIGH
    severityMedium = banditSummary.SEVERITY_MEDIUM + gosecSummary.SEVERITY_MEDIUM
    severityLow = banditSummary.SEVERITY_LOW + gosecSummary.SEVERITY_LOW
  }
  let summary = 'SEVERITY_HIGH: ' + severityHigh + '\n'
  summary += 'SEVERITY_MEDIUM: ' + severityMedium + '\n'
  summary += 'SEVERITY_LOW: ' + severityLow + '\n'

  return summary
}

/**
 * @param banditReport the Bandit output converted into valid 'output' object for check run conclusion
 * @param gosecReport the Gosec output converted into valid 'output' object for check run conclusion
 * for reference of the 'output' object see: https://developer.github.com/v3/checks/runs/#output-object
 */
module.exports = (banditReport, gosecReport) => {
  let title, summary
  let annotations = []

  if (banditReport.title === config.noIssuesResultTitle && banditReport.title === gosecReport.title) {
    title = config.noIssuesResultTitle
    summary = config.noIssuesResultSummary
  } else {
    title = config.issuesFoundResultTitle
    summary = mergeSummaries(banditReport.summary, gosecReport.summary)
  }

  if (!gosecReport.annotations) {
    annotations = banditReport.annotations
  } else if (!banditReport.annotations) {
    annotations = gosecReport.annotations
  } else {
    annotations = annotations.concat(gosecReport.annotations, banditReport.annotations)
  }
  return { title, summary, annotations }
}
