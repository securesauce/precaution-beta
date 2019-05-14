// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const generateReport = require('../linters/bandit/bandit_report')

const banditResults = require('./fixtures/reports/bandit_vulnerable.json')

describe('Bandit report generation', () => {
  let report

  beforeEach(() => {
    report = generateReport(banditResults)
  })

  test('Creates correct report structure', () => {
    expect(report).toHaveProperty('annotations')
    expect(report).toHaveProperty('issueCount.errors')
    expect(report).toHaveProperty('issueCount.warnings')
    expect(report).toHaveProperty('issueCount.notices')
    expect(report).toHaveProperty('moreInfo')
  })

  test('Creates correct annotations', () => {
    expect(report.annotations).toHaveLength(4)
    expect(report.annotations[0].end_line).toBe(8)
    expect(report.annotations[3].start_line).toBe(15)
    expect(report.annotations[1].path).toBe('mix.py')
    expect(report.annotations[2].title).toBe('B305: blacklist')

    report.annotations.forEach(annotation => {
      expect(annotation.annotation_level).toMatch(/notice|warning|failure/)
      expect(annotation.message).not.toBe('')
    })
  })

  test('Creates correct issue count', () => {
    expect(report.issueCount.errors).toBe(1)
    expect(report.issueCount.warnings).toBe(3)
    expect(report.issueCount.notices).toBe(0)
  })

  test('Handles no vulnerable reports', () => {
    const jsonResults = require('./fixtures/reports/bandit_safe.json')

    const report = generateReport(jsonResults)

    expect(report.annotations).toHaveLength(0)
    expect(report.issueCount.errors).toBe(0)
    expect(report.issueCount.warnings).toBe(0)
    expect(report.issueCount.notices).toBe(0)
  })
})
