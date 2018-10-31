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
 * @param {String} filePath
 * @param {function} resolve JS promise callback if everything succeeds
 * @param {function} reject JS promise callback if something fails
 */
module.exports.readFile = (filePath, resolve, reject) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      reject(err)
    }
    const results = parseJSON(data)

    resolve(results)
  })
}
