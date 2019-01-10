// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')

const { run } = require('../runner')
const Bandit = require('../linters/bandit')

function bandit (dir, files) {
  return run(new Bandit(), dir, files)
}

describe('Bandit runner', () => {
  test('Finds issues in invalid file', async () => {
    const report = await bandit('test/fixtures/python', ['mix.invalid.py'])

    expect(report.annotations.length).toEqual(4)
    expect(report.annotations[0].start_line).toEqual(8)
    expect(report.annotations[1].start_line).toEqual(11)
    expect(report.annotations[2].start_line).toEqual(13)
    expect(report.annotations[3].start_line).toEqual(15)
  })

  test('Passes on correct file', async () => {
    const report = await bandit('test/fixtures/python', ['mix.valid.py'])

    expect(report.annotations.length).toEqual(0)
  })

  test('Handles empty input', async () => {
    const report = await bandit('test/fixtures/python', [])

    expect(report.annotations.length).toEqual(0)
  })

  afterEach(() => {
    fs.remove('test/fixtures/bandit.json')
  })
})
