// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('./config')

const fmt = (name, count, symbol) => {
  if (!count) {
    return ''
  }
  return `:${symbol}: ${count} ${name}${count > 1 ? 's' : ''}\n`
}

const mergeSummaries = (summaries) => {
  let summary = ''

  const errors = summaries.map(s => s.errors).reduce((a, b) => a + b, 0)
  summary += fmt('error', errors, 'x')

  const warnings = summaries.map(s => s.warnings).reduce((a, b) => a + b, 0)
  summary += fmt('warning', warnings, 'warning')

  const notices = summaries.map(s => s.notices).reduce((a, b) => a + b, 0)
  summary += fmt('notice', notices, 'information_source')

  return summary
}

/**
 * @param {any[]} reports linter report objects to be merged
 * @returns merged report ready to be sent to GitHub
 * for object schema see: https://developer.github.com/v3/checks/runs/#output-object
 */
module.exports = (reports) => {
  const annotations = reports.map(r => r.annotations).flat()

  if (!annotations.length) {
    return { title: config.noIssuesResultTitle, summary: config.noIssuesResultSummary, annotations, text: '' }
  }

  const summary = mergeSummaries(reports.map(r => r.issueCount))

  const text = reports.map(r => r.moreInfo).reduce((a, b) => a + b, '')
  return { title: config.issuesFoundResultTitle, summary, annotations, text }
}
