// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotationLevel } = require('../annotations_levels')

/**
 * Create bandit Annotations
 * @param {*} issue
 * @returns {Object} see https://developer.github.com/v3/checks/runs/#annotations-object-1
 */
function getAnnotation (issue) {
  const path = issue.filename
  const startLine = issue.line_number
  const endLine = issue.line_number
  const annotationLevel = getAnnotationLevel(issue.issue_severity, issue.issue_confidence)
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

module.exports.getAnnotation = getAnnotation
