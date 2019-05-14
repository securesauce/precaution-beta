// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const Bandit = require('./bandit/bandit')
const Gosec = require('./gosec/gosec')
const TSLint = require('./tslint/tslint')

module.exports = {
  BANDIT: new Bandit(),
  GOSEC: new Gosec(),
  TSLINT: new TSLint()
}
