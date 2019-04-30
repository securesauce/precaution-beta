// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause
const fs = require('fs')
const yaml = require('js-yaml')

const { isExcluded } = require('../filter/')

describe('Config options tests', () => {
  let sampleConfigObj = ''

  beforeAll(() => {
    const rawSampleFile = fs.readFileSync('test/fixtures/config_files/sample_config.yaml', 'utf8')
    sampleConfigObj = yaml.safeLoad(rawSampleFile)
  })

  test('Exclude files test', () => {
    const files = ['tests/func_test.js', 'workflow_test.go', 'src/cmd/main.py']
    files.forEach(file => {
      expect(isExcluded(file, sampleConfigObj.exclude)).toBe(true)
    })
  })

  test('No excluded files test', () => {
    const files = ['../tests/', 'workflow.go', 'src/cmd/utilities.py']
    files.forEach(file => {
      expect(isExcluded(file, sampleConfigObj.exclude)).toBe(false)
    })
  })
})
