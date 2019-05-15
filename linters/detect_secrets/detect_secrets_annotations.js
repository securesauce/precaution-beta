// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const pathLib = require('path')

const { getAnnotationLevel } = require('../../annotations_levels')

/**
 * @param {*} issue an issue from which the annotation will be build
 * @param {String} filePath file path where the issue is located
 * @return {Object} returns an annotation object as specified here:
 * https://developer.github.com/v3/checks/runs/#annotations-object
 */
function getAnnotation (issue, filePath) {
  const path = pathLib.normalize(filePath)
  const startLine = issue.line_number
  const endLine = startLine
  const annotationLevel = getAnnotationLevel('HIGH', 'LOW')
  const title = issue.type
  const message = `The issue was found by the ${issue.type} plugin in detect-secrets.`

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
