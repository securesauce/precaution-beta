// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const gosec = require('../gosec/gosec')
const { config } = require('../config')
const fs = require('fs-extra')

describe('Spawn gosec tests', () => {
  test('Empty input for gosec', async () => {
    const results = await gosec('')
    expect(results).toBeFalsy()
  })

  test('Run gosec on non go files', async () => {
    await gosec('test/fixtures/go/src/non_go_files')
      .catch((err) => {
        let expected = config.noGoFilesFound
        expect(err.message).toEqual(expected)
      })
  })

  test('Run gosec on a go file without security problems', async () => {
    const results = await gosec('test/fixtures/go/src/secure_go_files')
    expect(results.Issues.length).toEqual(0)
    fs.remove('test/fixtures/go/src/secure_go_files/gosec.json')
  })

  test('Run gosec on go problematic file', async () => {
    const results = await gosec('test/fixtures/go/src/bad_files')
    expect(results.Stats.found).toBeGreaterThan(0)
    fs.remove('test/fixtures/go/src/bad_files/gosec.json')
  })
})
