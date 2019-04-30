// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const config = {
  cleanupAfterRun: true,
  fileExtensions: ['.py', '.pyw', '.go', '.js', '.ts'],
  checkRunName: 'Precaution',
  noIssuesResultTitle: 'No issues found',
  noIssuesResultSummary: 'There were no issues found.',
  issuesFoundResultTitle: 'Issues found',
  syntaxErrorTitle: 'ERROR: Syntax error',
  moreInfoTitle: 'For more information about the issues follow the links: \n',
  tslintProjectWebsite: 'https://github.com/webschik/tslint-config-security',
  numFilesPerPage: 30,
  numAnnotationsPerUpdate: 50,
  configFilePath: '.precaution.yaml'
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
