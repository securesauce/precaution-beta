// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

function annotation (issue) {
  const path = issue.filename
  const startLine = issue.line_number
  const endLine = issue.line_range[issue.line_range.length - 1]
  const annotationLevel = 'warning'
  const title = `${issue.test_id}:${issue.test_name}`
  const message = issue.issue_text

  return { path,
    start_line: startLine,
    end_line: endLine,
    annotation_level: annotationLevel,
    title,
    message
  }
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

  return { title, summary, annotations }
}
