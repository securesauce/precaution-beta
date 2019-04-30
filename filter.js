// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('./config')

const minimatch = require('minimatch')
const path = require('path')

/**
 * Checks whether a file should be excluded from processing
 * @param {String} filePath path of file to check
 * @param {String[]} excludes array of exclusion rules to compare to
 */
function isExcluded (filePath, excludes) {
  let ok = false
  for (let excludeRule of excludes) {
    excludeRule = path.normalize(excludeRule)
    if (minimatch(filePath, excludeRule, { matchBase: true })) {
      ok = true
      break
    }
  }
  return ok
}

/**
 * Filters the listed files and returns only the files relevant to us
 * @param {*} rawData the raw output from list files API call
 * @param {String[]} excludes excludes globs provided by the user to filter files/folders
 * @return {Promise[]<any>} the filtered GitHub response
 */
function filterData (rawData, excludes) {
  return rawData.data
    .filter(file =>
      config.fileExtensions.reduce(
        (acc, ext) => acc || file.filename.endsWith(ext),
        false
      )
    )
    .filter(fileJSON => fileJSON.status !== 'removed')
    .map(fileInfo => {
      return fileInfo.filename
    })
    .filter(filePath => !isExcluded(filePath, excludes))
}

module.exports.filterData = filterData
