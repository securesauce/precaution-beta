const fs = require('fs-extra')
const path = require('path')

/**
 * Get the cache path for this PR branch tag
 * @param {number} prID pull request identifier
 * @param {string} branchTag branch name
 */
function getBranchPath(prID, branchTag) {
  return path.join('cache', prID.toString(), branchTag)
}

/**
 * Save a file to local PR cache, distinguish by revision
 * @param {number} prID unique pull request identifier
 * @param {string} branchTag a tag to identify the current file revision
 * @param {string} filePath relative file path
 * @param {any} data file data
 */
function saveFileToPRCache(prID, branchTag, filePath, data) {
  writeFileCreateDirs(path.join('cache', prID.toString(), branchTag, filePath), data)
}

/**
 * Delete pr cache folder
 * @param {number} prID pull request identifier
 */
function clearPRCache(prID) {
  fs.removeSync(path.join('cache', prID.toString()))
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
