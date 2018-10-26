// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const runBandit = require('../bandit/bandit')

describe('Bandit runner', () => {
  test('Handles baseline option', async () => {
    const baselineFile = '../reports/keysizes.baseline.json'
    const results = await runBandit('test/fixtures/python', ['key_sizes.py'], { baselineFile })

    expect(results.results.length).toBe(2)
    expect(results.results[0].line_number).toBe(5)
    expect(results.results[1].line_number).toBe(8)
  })

  // This test is needed when a PR is without python or go files
  // and when our app gets the content of the PR
  // it wouldnt get any files because we filter them.
  test('Handles empty input', async () => {
    const results = await runBandit('test/fixtures', [])

    expect(results).toBeNull()
  })
})
