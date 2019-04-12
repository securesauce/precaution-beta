// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')
const { run } = require('../runner')

const TSLint = require('../linters/tslint')

function tslint (dir, files) {
  return run(new TSLint(), dir, files)
}

describe('TSLint runner', () => {
  test('Finds issues in vulnerable file', async () => {
    const report = await tslint('test/fixtures/javascript', ['vulnerable.js'])

    expect(report.annotations.length).toEqual(3)
    expect(report.annotations[0].start_line).toEqual(12)
    expect(report.annotations[1].start_line).toEqual(18)
    expect(report.annotations[2].start_line).toEqual(6)
  })

  test('Passes on safe file', async () => {
    const report = await tslint('test/fixtures/javascript', ['safe.js'])

    expect(report.annotations.length).toEqual(0)
  })

  test('Handles empty input', async () => {
    const report = await tslint('test/fixtures/javascript', [])

    expect(report.annotations.length).toEqual(0)
  })

  afterEach(() => {
    fs.remove('test/fixtures/tslint_output.json')
  })
})
