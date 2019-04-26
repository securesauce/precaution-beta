// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const generateReport = require('../gosec/gosec_report')

const gosecResults = require('./fixtures/reports/gosec_vulnerable.json')

describe('Gosec report generation', () => {
  let report

  beforeEach(() => {
    report = generateReport(gosecResults, 'test/fixtures/go/src')
  })

  test('Creates correct report structure', () => {
    expect(report).toHaveProperty('annotations')
    expect(report).toHaveProperty('issueCount.errors')
    expect(report).toHaveProperty('issueCount.warnings')
    expect(report).toHaveProperty('issueCount.notices')
    expect(report).toHaveProperty('moreInfo')
  })

  test('Creates correct annotations', () => {
    expect(report.annotations).toHaveLength(6)
    expect(report.annotations[0].end_line).toBe(16)
    expect(report.annotations[3].start_line).toBe(28)
    expect(report.annotations[1].path).toBe('bad_files/badTestFile.go')
    expect(report.annotations[2].title).toEqual(expect.stringContaining('G302'))

    report.annotations.forEach(annotation => {
      expect(annotation.annotation_level).toMatch(/notice|warning|failure/)
      expect(annotation.message).not.toBe('')
    })
  })

  test('Creates correct issue count', () => {
    expect(report.issueCount.errors).toBe(1)
    expect(report.issueCount.warnings).toBe(5)
    expect(report.issueCount.notices).toBe(0)
  })

  test('Handles no vulnerable reports', () => {
    const jsonResults = require('./fixtures/reports/gosec_safe.json')

    const report = generateReport(jsonResults)

    expect(report.annotations).toHaveLength(0)
    expect(report.issueCount.errors).toBe(0)
    expect(report.issueCount.warnings).toBe(0)
    expect(report.issueCount.notices).toBe(0)
  })
})
