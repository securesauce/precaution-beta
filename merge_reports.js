// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('./config')

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
  } else {
    title = config.issuesFoundResultTitle
  }

  summary = '\n' + 'Gosec summary: \n' + gosecReport.summary + '\n \n' +
                                '-----------------------------------------------------------------' +
                                '\nBandit summuary' + '\n' + banditReport.summary

  if (!gosecReport.annotations) {
    annotations = banditReport.annotations
  } else if (!banditReport.annotations) {
    annotations = gosecReport.annotations
  } else {
    annotations = annotations.concat(gosecReport.annotations, banditReport.annotations)
  }
  return { title, summary, annotations }
}
