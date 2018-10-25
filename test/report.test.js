// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const generateReport = require('../report')

const banditResults = require('./fixtures/reports/mix_results.json')

describe('Report generation', () => {
  let report

  beforeEach(() => {
    report = generateReport(banditResults)
  })

  test('Creates correct annotations', () => {
    expect(report.annotations).toHaveLength(4)
    expect(report.annotations[0].end_line).toBe(8)
    expect(report.annotations[3].start_line).toBe(15)
    expect(report.annotations[1].path).toBe('mix.py')
    expect(report.annotations[2].title).toBe('B305:blacklist')

    report.annotations.forEach(annotation => {
      expect(annotation.annotation_level).toMatch(/notice|warning|failure/)
      expect(annotation.message).not.toBe('')
    })
  })

  test('Creates correct report structure', () => {
    expect(report.summary).not.toBe('')
    expect(report).toHaveProperty('annotations')
    expect(report).toHaveProperty('title')
  })

  test('Handles empty reports', () => {
    const report = generateReport(null)

    expect(report).toHaveProperty('summary')
    expect(report).toHaveProperty('annotations')
    expect(report).toHaveProperty('title')
  })
})
