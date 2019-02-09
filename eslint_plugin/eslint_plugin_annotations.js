// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

/**
 * @param {*} filePath path to the file containing the issue
 * @param {*} issue
 * @return {Object} returns an annotation object as specified here:
 * @see {@link https://developer.github.com/v3/checks/runs/#annotations-object }
 */
function setupSingleAnnotation (filePath, issue) {
  const path = filePath
  const startLine = issue.line
  const endLine = issue.endLine
  let annotationLevel = 'notice'
  if (issue.severity === 1) {
    annotationLevel = 'warning'
  } else if (issue.severity === 2) {
    annotationLevel = 'failure'
  }
  const title = issue.ruleId
  const message = issue.message
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
 * @param {Object} fileWithIssues object containing all the issues for a given file
 * @return {Object[]} returns an array of annotation objects as specified here:
 * @see {@link https://developer.github.com/v3/checks/runs/#annotations-object }
 */
function getAnnotations (fileWithIssues) {
  let annotations = []
  for (let i = 0; i < fileWithIssues.messages.length; ++i) {
    const issue = fileWithIssues.messages[i]
    annotations.push(setupSingleAnnotation(fileWithIssues.filePath, issue))
  }
  return annotations
}

module.exports.getAnnotations = getAnnotations
