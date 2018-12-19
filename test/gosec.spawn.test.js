// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')

const { run } = require('../runner')
const Gosec = require('../linters/gosec')

function gosec (dir, files) {
  return run(new Gosec(), dir, files)
}

describe('Gosec runner', () => {
  test('Finds issues in invalid file', async () => {
    const report = await gosec('test/fixtures/go/src/bad_files', ['bad_test_file.go'])

    expect(report.annotations.length).toEqual(6)
    expect(report.annotations[0].start_line).toEqual('15')
    expect(report.annotations[1].start_line).toEqual('19')
    expect(report.annotations[2].start_line).toEqual('26')
    expect(report.annotations[3].start_line).toEqual('27')
  })

  test('Passes on correct file', async () => {
    const report = await gosec('test/fixtures/go/src/secure_go_files', ['hello_world.go'])

    expect(report.annotations.length).toEqual(0)
  })

  test('Handles packages with multiple files', async () => {
    const report = await gosec('test/fixtures/go/src/multiple_bad_files/', ['bad_test_file.go', 'networking_binding.go', 'randNumTest.go'])

    expect(report.annotations.length).toEqual(8)
    expect(report.annotations[4].start_line).toEqual('9')
    expect(report.annotations[7].start_line).toEqual('16')
  })

  afterEach(() => {
    fs.remove('test/fixtures/go/src/gosec.json')
  })
})
