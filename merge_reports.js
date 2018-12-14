// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('./config')
/**
 * @param {Number} errors the number of errors found
 * @param {Number} warnings the number of warnings found
 * @param {Number} notices the number of notices found
 */
function getCorrectSummary (errors, warnings, notices) {
  let summary = ''
  let errorPrefix = errors > 1 ? 'There were ' + errors + ' errors found.' : 'There was 1 error found.'
  let warningPrefix = warnings > 1 ? 'There were ' + warnings + ' warnings found.' : 'There was 1 warning found.'
  let noticePrefix = notices > 1 ? 'There were ' + notices + ' notices found.' : 'There was 1 notices.'

  let errorsMessage = errorPrefix + ' The errors are marked in red.\n'
  let warningsMessage = warningPrefix + ' The warnings are marked with orange.\n'
  let noticesMessage = noticePrefix + ' The notices are marked in white.\n'

  summary += errors !== 0 ? errorsMessage : ''
  summary += warnings !== 0 ? warningsMessage : ''
  summary += notices !== 0 ? noticesMessage : ''

  return summary
}

function mergeSummaries (banditSummary, gosecSummary) {
  let result = { errors: 0, warnings: 0, notices: 0 }

  if (banditSummary === config.noIssuesResultSummary) {
    result = gosecSummary
  } else if (gosecSummary === config.noIssuesResultSummary) {
    result = banditSummary
  } else {
    result.errors = banditSummary.errors + gosecSummary.errors
    result.warnings = banditSummary.warnings + gosecSummary.warnings
    result.notices = banditSummary.notices + gosecSummary.notices
  }

  return getCorrectSummary(result.errors, result.warnings, result.notices)
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
