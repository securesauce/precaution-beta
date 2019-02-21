// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')

const { run } = require('../runner')
const Bandit = require('../linters/bandit')

function bandit (dir, files) {
  return run(new Bandit(), dir, files)
}

describe('Bandit runner', () => {
  test('Finds issues in vulnerable file', async () => {
    const report = await bandit('test/fixtures/python', ['mix.vulnerable.py'])

    expect(report.annotations.length).toEqual(4)
    expect(report.annotations[0].start_line).toEqual(8)
    expect(report.annotations[1].start_line).toEqual(11)
    expect(report.annotations[2].start_line).toEqual(13)
    expect(report.annotations[3].start_line).toEqual(15)
  })

  test('Passes on safe file', async () => {
    const report = await bandit('test/fixtures/python', ['mix.safe.py'])

    expect(report.annotations.length).toEqual(0)
  })

  test('Handles empty input', async () => {
    const report = await bandit('test/fixtures/python', [])

    expect(report.annotations.length).toEqual(0)
  })

  test('Handles when there are invalid and valid python files', async () => {
    let mixedReport = await bandit('test/fixtures/python', ['sum.invalid.py', 'https.py'])

    expect(mixedReport.annotations.length).toBe(4)
    expect(mixedReport.annotations[0].title).toBe('B309:blacklist')
    expect(mixedReport.annotations[3].path).toEqual('sum.invalid.py')
    expect(mixedReport.annotations[3].start_line).toBe(1)
    expect(mixedReport.annotations[3].annotation_level).toBe('failure')
    expect(mixedReport.annotations[3].title).toBe('ERROR:Invalid file')
  })

  afterEach(() => {
    fs.remove('test/fixtures/bandit.json')
  })
})
