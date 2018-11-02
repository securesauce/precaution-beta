// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const config = {
  cleanupAfterRun: true,
  compareAgainstBaseline: false,
  fileExtensions: ['.py', '.pyw', '.go'],
  checkRunName: 'Frisk',
  noIssuesResultTitle: 'No issues found',
  noIssuesResultSummary: 'There were no issues found.',
  issuesFoundResultTitle: 'Issues found'
}

const annotationsLevels = {
  // severity levels low:
  severityHIGHconfidenceHIGH: 'failure',
  severityHIGHconfidenceMEDIUM: 'failure',
  severityHIGHconfidenceLOW: 'failure',
  // severity levels medium:
  severityMEDIUMconfidenceHIGH: 'warning',
  severityMEDIUMconfidenceMEDIUM: 'warning',
  severityMEDIUMconfidenceLOW: 'warning',
  // severity level low:
  severityLOWconfidenceHIGH: 'warning',
  severityLOWconfidenceMEDIUM: 'warning',
  severityLOWconfidenceLOW: 'notice'
}

module.exports = {
  config,
  annotationsLevels
}
