// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { annotationsLevels } = require('./config')

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