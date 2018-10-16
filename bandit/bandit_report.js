// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

function annotation (issue) {
  const path = issue.filename
  const startLine = issue.line_number
  const endLine = issue.line_range[issue.line_range.length - 1]
  const annotationLevel = 'warning'
  const title = `${issue.test_id}:${issue.test_name}`
  const message = issue.issue_text

  return { 
    path,
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

  let title, summary, annotations

  if (results){
    results = results || { results: [] }
  
    title = 'Bandit security linter'
    // That way I created the output of the summary more beatiful and readable
    summary = JSON.stringify(results.metrics || 'N/A', null, "\n")
    annotations = results.results.map(issue => annotation(issue))
  }

  // This is when there are no security issues or there are no python files in the PR
  if(!annotations || annotations.length === 0){
    title = 'All clear'
    summary = 'There are no security issues found.'
  }
  
  return { title, summary, annotations }
}
