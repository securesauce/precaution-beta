// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const mergeReports = require('../merge_reports')
const banditAnnotations = require('./fixtures/annotations/mixed_levels_annotations.json').annotations
const gosecAnnotations = require('./fixtures/annotations/gosec_mix_annotations.json').annotations

describe('Merge reports tests from Bandit and Gosec reports', () => {
  test('No issues found from both Gosec and Bandit', () => {
    let banditReport = { title: config.noIssuesResultTitle, summary: config.noIssuesBanditResultSummary, annotations: [] }
    let gosecReport = { title: config.noIssuesResultTitle, summary: config.noIssuesGosecResultSummary, annotations: [] }

    let expectedSummary = '\n' + 'Gosec summary: \n' + gosecReport.summary + '\n \n' +
          '-----------------------------------------------------------------' +
          '\nBandit summuary' + '\n' + banditReport.summary

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.noIssuesResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations.length).toBe(0)
  })

  test('Issues found by Bandit and no issues found by Gosec', () => {
    const { metrics } = require('./fixtures/reports/mix_results.json')
    const banditSummary = JSON.stringify(metrics || 'N/A', null, '\n')

    let banditReport = { title: config.issuesFoundResultTitle, summary: banditSummary, annotations: banditAnnotations }
    let gosecReport = { title: config.noIssuesResultTitle, summary: config.noIssuesGosecResultSummary, annotations: [] }

    let expectedSummary = '\n' + 'Gosec summary: \n' + config.noIssuesGosecResultSummary + '\n \n' +
    '-----------------------------------------------------------------' +
          '\nBandit summuary' + '\n' + banditReport.summary

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(banditAnnotations)
    expect(result.annotations.length).toBe(banditAnnotations.length)
  })

  test('No issues found by Bandit but issues are found by Gosec', () => {
    let { stats } = require('./fixtures/reports/gosec_mix_results.json')
    const gosecSummary = JSON.stringify(stats || 'N/A', null, '\n')

    let banditReport = { title: config.noIssuesResultTitle, summary: config.noIssuesBanditResultSummary, annotations: [] }
    let gosecReport = { title: config.issuesFoundResultTitle, summary: gosecSummary, annotations: gosecAnnotations }

    let expectedSummary = '\n' + 'Gosec summary: \n' + gosecReport.summary + '\n \n' +
          '-----------------------------------------------------------------' +
          '\nBandit summuary' + '\n' + config.noIssuesBanditResultSummary

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(gosecAnnotations)
    expect(result.annotations.length).toBe(gosecAnnotations.length)
  })

  test('Issues found by Bandit and by Gosec', () => {
    const { metrics } = require('./fixtures/reports/mix_results.json')
    const banditSummary = JSON.stringify(metrics || 'N/A', null, '\n')

    let { stats } = require('./fixtures/reports/gosec_mix_results.json')
    const gosecSummary = JSON.stringify(stats || 'N/A', null, '\n')

    let banditReport = { title: config.issuesFoundResultTitle, summary: banditSummary, annotations: banditAnnotations }
    let gosecReport = { title: config.issuesFoundResultTitle, summary: gosecSummary, annotations: gosecAnnotations }

    let expectedSummary = '\n' + 'Gosec summary: \n' + gosecReport.summary + '\n \n' +
          '-----------------------------------------------------------------' +
          '\nBandit summuary' + '\n' + banditReport.summary

    let expectedAnnotations = []
    expectedAnnotations = expectedAnnotations.concat(gosecAnnotations, banditAnnotations)

    const result = mergeReports(banditReport, gosecReport)
    expect(result.title).toEqual(config.issuesFoundResultTitle)
    expect(result.summary).toEqual(expectedSummary)
    expect(result.annotations).toEqual(expectedAnnotations)
    expect(result.annotations.length).toBe(gosecAnnotations.length + banditAnnotations.length)
  })
})
