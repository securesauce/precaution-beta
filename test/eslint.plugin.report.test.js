// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const generateReport = require('../eslint_plugin/eslint_plugin_report')

const eslintResults = require('./fixtures/reports/eslint_vulnerable.json')

describe('ESlint plugin report generation', () => {
  let report

  beforeEach(() => {
    report = generateReport(eslintResults, 'test/fixtures/go/src')
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
    expect(report.annotations[0].end_line).toBe(56)
    expect(report.annotations[2].start_line).toBe(31)
    expect(report.annotations[1].path).toEqual('precaution/test/index.test.js')

    report.annotations.forEach(annotation => {
      expect(annotation.annotation_level).toMatch(/notice|warning|failure/)
      expect(annotation.message).not.toBe('')
    })
  })

  test('Creates correct issue count', () => {
    expect(report.issueCount.errors).toBe(0)
    expect(report.issueCount.warnings).toBe(4)
    expect(report.issueCount.notices).toBe(0)
  })

  test('Handles no vulnerable reports', () => {
    const jsonResults = require('./fixtures/reports/eslint_safe.json')

    const report = generateReport(jsonResults)

    expect(report.annotations).toHaveLength(0)
    expect(report.issueCount.errors).toBe(0)
    expect(report.issueCount.warnings).toBe(0)
    expect(report.issueCount.notices).toBe(0)
  })
})
