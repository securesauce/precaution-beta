// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getAnnotationLevel } = require('../annotations_levels')

/**
 * Translates the tslint severity from "ERROR" | "WARNING" | "OFF"
 * to the "HIGH", "MEDIUM" and "LOW"
 * @param {String} severity issues severity given by tslint
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
 * Create bandit Annotations
 * @param {*} issue
 * @param {String} directory working directory for the Gosec process
 * @returns {Object} see https://developer.github.com/v3/checks/runs/#annotations-object-1
 */
function getAnnotation (issue, directory) {
  const path = issue.name.replace(directory + '/', '')
  const startLine = issue.startPosition.line
  const endLine = issue.endPosition.line
  const annotationLevel = getAnnotationLevel(translateSeverity(issue.ruleSeverity), 'HIGH')
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
