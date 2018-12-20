// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { annotationsLevels } = require('./config')

/**
 * @param {Object[]} annotations the issues found by a security linter wrapped into this object:
 * https://developer.github.com/v3/checks/runs/#annotations-object
 */
function countAnnotationLevels (annotations) {
  let errors = 0
  let warnings = 0
  let notices = 0

  for (let annotation of annotations) {
    if (annotation.annotation_level === 'failure') {
      errors += 1
    } else if (annotation.annotation_level === 'warning') {
      warnings += 1
    } else {
      notices += 1
    }
  }
  return { errors, warnings, notices }
}

/**
 * @param {String} severity issue severity from bandit analyze
 * @param {String} confidence issue confidence from bandit analyze
 * @returns {String} the true annotation level
 */
function getAnnotationLevel (severity, confidence) {
  let result = 'warning'

  switch (severity) {
    case 'HIGH' :
      switch (confidence) {
        case 'HIGH' : result = annotationsLevels.severityHIGHconfidenceHIGH; break
        case 'MEDIUM' : result = annotationsLevels.severityHIGHconfidenceMEDIUM; break
        case 'LOW' : result = annotationsLevels.severityHIGHconfidenceLOW; break
      }
      break
    case 'MEDIUM' :
      switch (confidence) {
        case 'HIGH' : result = annotationsLevels.severityMEDIUMconfidenceHIGH; break
        case 'MEDIUM' : result = annotationsLevels.severityMEDIUMconfidenceMEDIUM; break
        case 'LOW' : result = annotationsLevels.severityMEDIUMconfidenceLOW; break
      }
      break
    case 'LOW' :
      switch (confidence) {
        case 'HIGH' : result = annotationsLevels.severityLOWconfidenceHIGH; break
        case 'MEDIUM' : result = annotationsLevels.severityLOWconfidenceMEDIUM; break
        case 'LOW' : result = annotationsLevels.severityLOWconfidenceLOW; break
      }
  }
  return result
}

module.exports.getAnnotationLevel = getAnnotationLevel
module.exports.countIssueLevels = countAnnotationLevels
