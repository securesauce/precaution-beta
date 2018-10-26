// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs')

/**
* Function which parses JSON into text format
* @param {*} data - data to be parsed
*/
function parseJSON (data) {
  try {
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

/**
 * The function reads the content ot the file
 * @param {function} resolve is a function that will be resolved if everything succeeds
 * @param {function} reject is a function that will be used if there is an error
 * @param {String} filePath
 */
module.exports.readFile = (filePath, resolve, reject) => {
  fs.readFile(readFile, 'utf8', (err, data) => {
    if (err) {
      reject(err)
    }
    const results = parseJSON(data)

    resolve(results)
  })
}
