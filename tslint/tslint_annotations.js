// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotationLevel } = require('../annotations_levels')

/**
 * Translates the tslint severity from "ERROR" | "WARNING" | "OFF"
 * to the "HIGH", "MEDIUM" and "LOW"
 * @param {String} severity the severity of the issue provided by  TSLint
 * @returns {String} severity of an issue compatible with the GitHub API
 */
function translateSeverity (severity) {
  let result = ''
  switch (severity) {
    case 'ERROR': result = 'HIGH'; break
    case 'WARNING': result = 'MEDIUM'; break
    case 'OFF': result = 'LOW'
  }
  return result
}

/**
 * Create TSLint Annotations
 * @param {*} issue
 * @returns {Object} see https://developer.github.com/v3/checks/runs/#annotations-object-1
 */
function getAnnotation (issue) {
  const path = issue.name
  // We need to add 1 to the startLine and endline because they are off by 1
  // because the JSON format for TSLint numerates the lines starting from 0
  const startLine = issue.startPosition.line + 1
  const endLine = issue.endPosition.line + 1
  const annotationLevel = getAnnotationLevel(translateSeverity(issue.ruleSeverity))
  const title = `${issue.ruleName}`
  const message = `${issue.failure}`

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
