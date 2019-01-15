// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const mergeReports = require('../merge_reports')

const { config } = require('../config')
const banditAnnotations = require('./fixtures/annotations/mixed_levels_annotations.json').annotations
const gosecAnnotations = require('./fixtures/annotations/gosec_mix_annotations.json').annotations

const noIssues = { errors: 0, warnings: 0, notices: 0 }
const someIssues = { errors: 1, warnings: 4, notices: 2 }
const moreIssues = { errors: 4, warnings: 3, notices: 0 }

const report = (issueCount, annotations) => {
  return { annotations, issueCount, moreInfo: '' }
}

describe('Merge reports tests from Bandit and Gosec reports', () => {
  test('No issues', () => {
    const banditReport = report(noIssues, [])
    const gosecReport = report(noIssues, [])

    const result = mergeReports([banditReport, gosecReport])
    expect(result.title).toEqual(config.noIssuesResultTitle)
    expect(result.summary).toEqual(config.noIssuesResultSummary)
    expect(result.annotations).toHaveLength(0)
  })

  test('Bandit issues', () => {
    // We don't need the issue count to correspond to the actual annotations (code handles them separately)
    const banditReport = report(someIssues, banditAnnotations)
    const gosecReport = report(noIssues, [])

    const expectedSummary = ':x: 1 error\n' +
      ':warning: 4 warnings\n' +
      ':information_source: 2 notices\n'

    const result = mergeReports([banditReport, gosecReport])
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(banditAnnotations)
  })

  test('Gosec issues', () => {
    const banditReport = report(noIssues, [])
    const gosecReport = report(moreIssues, gosecAnnotations)

    const expectedSummary = ':x: 4 errors\n' +
      ':warning: 3 warnings\n'

    const result = mergeReports([banditReport, gosecReport])
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(gosecAnnotations)
  })

  test('Both issues', () => {
    const banditReport = report(someIssues, banditAnnotations)
    const gosecReport = report(moreIssues, gosecAnnotations)

    const expectedSummary = ':x: 5 errors\n' +
      ':warning: 7 warnings\n' +
      ':information_source: 2 notices\n'

    const result = mergeReports([banditReport, gosecReport])
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toHaveLength(5)
  })
})
