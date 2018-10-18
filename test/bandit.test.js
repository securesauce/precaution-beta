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
  })

  test('Analyze python file with security issues', async () => {
    const results = await runBandit('test/fixtures/python', ['key_sizes.py'])

    const trueResults = generateReport(results)
    const expected = fs.readFileSync('test/fixtures/reports/key_sizes_results.txt', 'utf8')

    expect(trueResults.summary).toEqual(expected)
  })

  test('Bandit run on file without security issues', async () => {
    const results = await runBandit('test/fixtures/python', ['hello_world.py'])

    const trueResults = generateReport(results)

    expect(trueResults.title).toEqual('All clear')
    expect(trueResults.summary).toEqual('There are no security issues found.')
    expect(trueResults.annotations.length).toEqual(0)
  })

  test('Bandit run on non Python file', async () => {
    const results = await runBandit('test/fixtures', ['hello_world.go'])

    const trueResults = generateReport(results)

    expect(trueResults.title).toEqual('All clear')
    expect(trueResults.summary).toEqual('There are no security issues found.')
    expect(trueResults.annotations.length).toEqual(0)
  })

  // This test is needed when a PR is without python or go files 
  // and when our app gets the content of the PR 
  // it wouldnt get any files because we filter them.
  test('Bandit run with an empty "inputFiles" parameters', async () => {
    const results = await runBandit('test/fixtures')

    const trueResults = generateReport(results)

    expect(trueResults.title).toEqual('All clear')
    expect(trueResults.summary).toEqual('There are no security issues found.')
    expect(trueResults.annotations).toBeFalsy()
  })

  afterAll(() => {
    fs.removeSync('test/fixtures/bandit.json')
  })
})
