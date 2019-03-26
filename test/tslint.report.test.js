// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const generateReport = require('../tslint/tslint_report')

const tslintResults = require('./fixtures/reports/tslint_vulnerable.json')

describe('TSLint report generation', () => {
  let report

  beforeEach(() => {
    report = generateReport(tslintResults, 'test/fixtures/js-ts')
  })

  test('Creates correct report structure', () => {
    expect(report).toHaveProperty('annotations')
    expect(report).toHaveProperty('issueCount.errors')
    expect(report).toHaveProperty('issueCount.warnings')
    expect(report).toHaveProperty('issueCount.notices')
    expect(report).toHaveProperty('moreInfo')
  })

  test('Creates correct annotations', () => {
    expect(report.annotations).toHaveLength(7)
    expect(report.annotations[0].end_line).toBe(56)
    expect(report.annotations[3].start_line).toBe(5)
    expect(report.annotations[5].path).toBe('test/fixtures/js-ts/testFile.js')
    expect(report.annotations[6].title).toEqual('tsr-detect-non-literal-fs-filename')

    report.annotations.forEach(annotation => {
      expect(annotation.annotation_level).toMatch(/notice|warning|failure/)
      expect(annotation.message).not.toBe('')
    })
  })

  test('Creates correct issue count', () => {
    expect(report.issueCount.errors).toBe(3)
    expect(report.issueCount.warnings).toBe(4)
    expect(report.issueCount.notices).toBe(0)
  })

  test('Handles no vulnerable reports', async () => {
    const report = generateReport([], '')

    expect(report.annotations).toHaveLength(0)
    expect(report.issueCount.errors).toBe(0)
    expect(report.issueCount.warnings).toBe(0)
    expect(report.issueCount.notices).toBe(0)
  })
})
