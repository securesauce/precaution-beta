// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')

const { run } = require('../runner')
const { config } = require('../config')
const Gosec = require('../linters/gosec')

function gosec (dir, files) {
  return run(new Gosec(), dir, files)
}

describe('Gosec runner', () => {
  test('Finds issues in vulnerable file', async () => {
    const report = await gosec('test/fixtures/go/src/vulnerable', ['bad_test_file.go'])

    expect(report.annotations.length).toEqual(6)
    expect(report.annotations[0].start_line).toEqual(15)
    expect(report.annotations[1].start_line).toEqual(19)
    expect(report.annotations[2].start_line).toEqual(26)
    expect(report.annotations[3].start_line).toEqual(27)
  })

  test('Handles invalid go file with syntax errors', async () => {
    const report = await gosec('test/fixtures/go/src/invalid_files', ['sum.invalid.go'])

    expect(report.annotations.length).toBe(5)
    expect(report.annotations[0].path).toEqual('sum.invalid.go')
    expect(report.annotations[0].start_line).toBe(7)
    expect(report.annotations[0].message).toBe('arr declared but not used')
    expect(report.annotations[2].annotation_level).toBe('failure')
    expect(report.annotations[4].title).toBe(config.syntaxErrorTitle)
  })

  test('Passes on safe file', async () => {
    const report = await gosec('test/fixtures/go/src/safe', ['hello_world.go'])

    expect(report.annotations.length).toEqual(0)
  })

  test('Handles packages with multiple files', async () => {
    const report = await gosec('test/fixtures/go/src/vulnerable_package/', ['bad_test_file.go', 'networking_binding.go'])

    expect(report.annotations.length).toEqual(7)
    expect(report.annotations[4].start_line).toEqual(9)
    expect(report.annotations[6].start_line).toEqual(27)
  })

  test('Handles empty input', async () => {
    const report = await gosec('test/fixtures/go/src', [])

    expect(report.annotations.length).toEqual(0)
  })

  afterEach(() => {
    fs.remove('test/fixtures/go/src/gosec_output.json')
  })
})
