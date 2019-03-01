// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const config = {
  cleanupAfterRun: true,
  fileExtensions: ['.py', '.pyw', '.go'],
  checkRunName: 'Precaution',
  noIssuesResultTitle: 'No issues found',
  noIssuesResultSummary: 'There were no issues found.',
  issuesFoundResultTitle: 'Issues found',
  syntaxErrorTitle: 'ERROR: Syntax error'
}

const annotationsLevels = {
  // severity levels HIGH:
  severityHIGHconfidenceHIGH: 'failure',
  severityHIGHconfidenceMEDIUM: 'failure',
  severityHIGHconfidenceLOW: 'failure',
  // severity levels MEDIUM:
  severityMEDIUMconfidenceHIGH: 'warning',
  severityMEDIUMconfidenceMEDIUM: 'warning',
  severityMEDIUMconfidenceLOW: 'warning',
  // severity level LOW:
  severityLOWconfidenceHIGH: 'warning',
  severityLOWconfidenceMEDIUM: 'warning',
  severityLOWconfidenceLOW: 'notice'
}

module.exports = {
  config,
  annotationsLevels
}
