// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const generateReport = require('../linters/detect_secrets/detect_secrets_report')

const detectSecretsResults = require('./fixtures/reports/detect_secrets.vulnerable')

describe('TSLint report generation', () => {
  let report = ''

  beforeEach(() => {
    report = generateReport(detectSecretsResults.results)
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
    expect(report.annotations[0].end_line).toBe(13)
    expect(report.annotations[1].start_line).toBe(68)
    expect(report.annotations[2].title).toEqual('Basic Auth Credentials')
    expect(report.annotations[3].path).toBe('test.yaml')

    report.annotations.forEach(annotation => {
      expect(annotation.annotation_level).toMatch(/notice|warning|failure/)
      expect(annotation.message).not.toBe('')
    })
  })

  test('Creates correct issue count', () => {
    expect(report.issueCount.errors).toBe(4)
    expect(report.issueCount.warnings).toBe(0)
    expect(report.issueCount.notices).toBe(0)
  })

  test('Handles no vulnerable reports', () => {
    const report = generateReport([], '')

    expect(report.annotations).toHaveLength(0)
    expect(report.issueCount.errors).toBe(0)
    expect(report.issueCount.warnings).toBe(0)
    expect(report.issueCount.notices).toBe(0)
  })
})
