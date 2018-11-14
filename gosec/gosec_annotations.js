// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const getAnnotationLevel = require('../annotations_levels')

/**
 * @param {*} issue - an issue from which the annotation will be build
 * @return {Object} returns an annotation object as specified here: 
 * https://developer.github.com/v3/checks/runs/#annotations-object 
 */
function getAnnotation (issue) {
  const path = issue.file
  const startLine = issue.line
  const endLine = issue.line
  const annotationLevel = getAnnotationLevel(issue.severity, issue.confidence)
  const title = `${issue.rule_id}:${issue.details}`
  const message = `The issue is in the code: ${issue.code}`

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
