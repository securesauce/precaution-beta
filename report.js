// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

function annotation (issue) {
  const path = issue.filename
  const start_line = issue.line_number
  const end_line = issue.line_range[issue.line_range.length - 1]
  const annotation_level = 'warning'
  const title = `${issue.test_id}:${issue.test_name}`
  const message = issue.issue_text

  return {path, start_line, end_line, annotation_level, title, message}
}

/**
 * Convert bandit output into valid 'output' object for check run conclusion
 * @param {any} results Bandit json output
 */
module.exports = (results) => {
  results = results || { results: [] }

  const title = 'Bandit security linter'
  const summary = JSON.stringify(results.metrics || 'N/A')
  const annotations = results.results.map(issue => annotation(issue))

  return {title, summary, annotations}
}
