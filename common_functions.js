// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

function doesAStringEndsWith (strArr, end) {
  for (let index = 0; index < strArr.length; index++) {
    if (strArr[index].endsWith(end)) {
      return true
    }
  }
  return false
}

module.exports.doesAStringEndsWith = doesAStringEndsWith
