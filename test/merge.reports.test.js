// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const mergeReports = require('../merge_reports')
const banditAnnotations = require('./fixtures/annotations/mixed_levels_annotations.json').annotations
const gosecAnnotations = require('./fixtures/annotations/gosec_mix_annotations.json').annotations

const banditSummary = { errors: 1, warnings: 1, notices: 1 }
const gosecSummary = { errors: 1, warnings: 1, notices: 0 }

describe('Merge reports tests from Bandit and Gosec reports', () => {
  test('No issues found from both Gosec and Bandit', () => {
    let banditReport = { title: config.noIssuesResultTitle, summary: config.noIssuesResultSummary, annotations: [] }
    let gosecReport = { title: config.noIssuesResultTitle, summary: config.noIssuesResultSummary, annotations: [] }

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.noIssuesResultTitle)
    expect(result.summary).toEqual(config.noIssuesResultSummary)
    expect(result.annotations.length).toBe(0)
  })

  test('Issues found by Bandit and no issues found by Gosec', () => {
    let banditReport = { title: config.issuesFoundResultTitle, summary: banditSummary, annotations: banditAnnotations }
    let gosecReport = { title: config.noIssuesResultTitle, summary: config.noIssuesResultSummary, annotations: [] }

    let expectedSummary = ':x: 1 error\n' +
      ':warning: 1 warning\n' +
      ':information_source: 1 notice\n'

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(banditAnnotations)
  })

  test('No issues found by Bandit but issues are found by Gosec', () => {
    let banditReport = { title: config.noIssuesResultTitle, summary: config.noIssuesResultSummary, annotations: [] }
    let gosecReport = { title: config.issuesFoundResultTitle, summary: gosecSummary, annotations: gosecAnnotations }

    let expectedSummary = ':x: 1 error\n' +
      ':warning: 1 warning\n'

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(gosecAnnotations)
  })

  test('Issues found by Bandit and by Gosec', () => {
    let banditReport = { title: config.issuesFoundResultTitle, summary: banditSummary, annotations: banditAnnotations }
    let gosecReport = { title: config.issuesFoundResultTitle, summary: gosecSummary, annotations: gosecAnnotations }

    let expectedSummary = ':x: 2 errors\n' +
      ':warning: 2 warnings\n' +
      ':information_source: 1 notice\n'

    let expectedAnnotations = []
    expectedAnnotations = expectedAnnotations.concat(gosecAnnotations, banditAnnotations)

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(expectedAnnotations)
  })
})
