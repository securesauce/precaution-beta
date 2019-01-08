// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const gosecReport = require('../gosec/gosec_report')
const { config } = require('../config')

describe('Gosec report tests', () => {
  test('Empty result parameter', () => {
    const trueReport = gosecReport('', '')
    expect(trueReport.title).toEqual(config.noIssuesResultTitle)
    expect(trueReport.summary).toEqual(config.noIssuesResultSummary)
    expect(trueReport.annotations.length).toEqual(0)
  })

  test('Generate valid report', () => {
    const mixedResults = require('./fixtures/reports/gosec_mix_results.json')
    const trueReport = gosecReport(mixedResults, './fixtures/reports/')
    expect(trueReport.title).toEqual(config.issuesFoundResultTitle)
    expect(trueReport.summary).not.toBe('')
    expect(trueReport.annotations.length).toBeGreaterThan(0)
  })
})
