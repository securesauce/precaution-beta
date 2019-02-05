// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')
const path = require('path')

/**
 * Get the cache path for this PR branch tag
 * @param {number} repoID repository identifier
 * @param {number} prID pull request identifier
 */
function getBranchPath (repoID, prID) {
  return path.join('cache/go/src', repoID.toString(), prID.toString())
}

/**
 * Save a file to local PR cache, distinguish by revision
 * @param {number} repoID unique repository identifier
 * @param {number} prID unique pull request identifier
 * @param {string} filePath relative file path
 * @param {any} data file data
 */
function saveFileToPRCache (repoID, prID, filePath, data) {
  const dir = getBranchPath(repoID, prID)
  writeFileCreateDirs(path.join(dir, filePath), data)
}

/**
 * Delete pr cache folder
 * @param {number} repoID repository identifier
 * @param {number} prID pull request identifier
 */
function clearPRCache (repoID, prID) {
  fs.removeSync(getBranchPath(repoID, prID))
  fs.removeSync(getBranchPath(repoID, prID))
}

/**
 * Save a file to a specific location and create required directories
 * @param {string} filePath path to file relative to main directory
 * @param {string} data file contents
 */
function writeFileCreateDirs (filePath, data) {
  fs.mkdirpSync(path.dirname(filePath))
  fs.writeFileSync(filePath, data)
}

module.exports.getBranchPath = getBranchPath
module.exports.saveFile = saveFileToPRCache
module.exports.clear = clearPRCache
