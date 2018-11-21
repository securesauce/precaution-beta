// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const mergeReports = require('../merge_reports')
const banditAnnotations = require('./fixtures/annotations/mixed_levels_annotations.json').annotations
const gosecAnnotations = require('./fixtures/annotations/gosec_mix_annotations.json').annotations

const banditSummary = { SEVERITY_HIGH: 1, SEVERITY_MEDIUM: 3, SEVERITY_LOW: 0 }
const gosecSummary = { SEVERITY_HIGH: 4, SEVERITY_MEDIUM: 3, SEVERITY_LOW: 1 }

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

    const expectedSummary = 'SEVERITY_HIGH: ' + banditSummary.SEVERITY_HIGH + '\n' + 'SEVERITY_MEDIUM: ' +
      banditSummary.SEVERITY_MEDIUM + '\n' + 'SEVERITY_LOW: ' + banditSummary.SEVERITY_LOW + '\n'

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(banditAnnotations)
  })

  test('No issues found by Bandit but issues are found by Gosec', () => {
    let banditReport = { title: config.noIssuesResultTitle, summary: config.noIssuesResultSummary, annotations: [] }
    let gosecReport = { title: config.issuesFoundResultTitle, summary: gosecSummary, annotations: gosecAnnotations }

    const expectedSummary = 'SEVERITY_HIGH: ' + gosecSummary.SEVERITY_HIGH + '\n' + 'SEVERITY_MEDIUM: ' +
      gosecSummary.SEVERITY_MEDIUM + '\n' + 'SEVERITY_LOW: ' + gosecSummary.SEVERITY_LOW + '\n'

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(gosecAnnotations)
  })

  test('Issues found by Bandit and by Gosec', () => {
    let banditReport = { title: config.issuesFoundResultTitle, summary: banditSummary, annotations: banditAnnotations }
    let gosecReport = { title: config.issuesFoundResultTitle, summary: gosecSummary, annotations: gosecAnnotations }

    const expectedSummary = 'SEVERITY_HIGH: ' + 5 + '\n' + 'SEVERITY_MEDIUM: ' + 6 +
      '\n' + 'SEVERITY_LOW: ' + 1 + '\n'

    let expectedAnnotations = []
    expectedAnnotations = expectedAnnotations.concat(gosecAnnotations, banditAnnotations)

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(expectedAnnotations)
  })
})
