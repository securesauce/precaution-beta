// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const config = {
  cleanupAfterRun: true,
  compareAgainstBaseline: false,
  fileExtensions: ['.py', '.pyw', '.go'],
  checkRunName: 'Frisk',
  noIssuesResultTitle: 'No issues found',
  noIssuesGosecResultSummary: 'There were no issues found by Gosec - golang security linter.',
  noIssuesBanditResultSummary: 'There were no issues found by Bandit - python security linter.',
  issuesFoundResultTitle: 'Issues found'
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
