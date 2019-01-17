// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const Bandit = require('./bandit')
const Gosec = require('./gosec')

module.exports = {
  BANDIT: new Bandit(),
  GOSEC: new Gosec()
}
