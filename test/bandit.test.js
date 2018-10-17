// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const runBandit = require('../bandit')
const generateReport = require('../report.js')
const fs = require('fs-extra')

describe('Bandit runner', () => {
  test('Handles baseline option', async () => {
    const baselineFile = '../reports/keysizes.baseline.json'
    const results = await runBandit('test/fixtures/python', ['key_sizes.py'], { baselineFile })

    expect(results.results.length).toBe(2)
    expect(results.results[0].line_number).toBe(5)
    expect(results.results[1].line_number).toBe(8)
    fs.removeSync('test/fixtures/bandit.json')
  })

  test('Analyze python file with security issues', async () => {
    const results = await runBandit('test/fixtures/python', ['test.py'])

    const trueResults = generateReport(results)
    const expected = fs.readFileSync('test/fixtures/reports/testResults.txt', 'utf8')

    expect(trueResults.summary).toBe(expected)
    fs.removeSync('test/fixtures/bandit.json')
  })

  test('Bandit run on file without security issues', async () => {
    const results = await runBandit('test/fixtures/python', ['HelloWorld.py'])

    const trueResults = generateReport(results)

    expect(trueResults.title).toEqual('All clear')
    expect(trueResults.summary).toEqual('There are no security issues found.')
    expect(trueResults.annotations.length).toEqual(0)
    fs.removeSync('test/fixtures/bandit.json')
  })

  test('Bandit run on non Python file', async () => {
    const results = await runBandit('test/fixtures', ['words.doc'])

    const trueResults = generateReport(results)

    expect(trueResults.title).toEqual('All clear')
    expect(trueResults.summary).toEqual('There are no security issues found.')
    expect(trueResults.annotations.length).toEqual(0)
    fs.removeSync('test/fixtures/bandit.json')
  })
})
