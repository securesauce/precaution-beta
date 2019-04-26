// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { annotationsLevels } = require('../config')
const { getAnnotationLevel } = require('../annotations_levels')

describe('Tests for annotation levels on issues with HIGH severity', () => {
  test('HIGH severity and HIGH confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('HIGH', 'HIGH')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityHIGHconfidenceHIGH)
  })

  test('HIGH severity and MEDIUM confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('HIGH', 'MEDIUM')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityHIGHconfidenceMEDIUM)
  })

  test('HIGH severity and LOW confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('HIGH', 'LOW')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityHIGHconfidenceLOW)
  })
})

describe('Tests for annotation levels on issues with MEDIUM severity', () => {
  test('MEDIUM severity and HIGH confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('MEDIUM', 'HIGH')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityMEDIUMconfidenceHIGH)
  })

  test('MEDIUM severity and MEDIUM confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('MEDIUM', 'MEDIUM')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityMEDIUMconfidenceMEDIUM)
  })

  test('MEDIUM severity and LOW confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('MEDIUM', 'LOW')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityMEDIUMconfidenceLOW)
  })
})

describe('Tests for annotation levels on issues with LOW severity', () => {
  test('LOW severity and HIGH confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('LOW', 'HIGH')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityLOWconfidenceHIGH)
  })

  test('LOW severity and MEDIUM confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('LOW', 'MEDIUM')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityLOWconfidenceMEDIUM)
  })

  test('LOW severity and LOW confidence', () => {
    const trueAnnotationLevel = getAnnotationLevel('LOW', 'LOW')
    expect(trueAnnotationLevel).toEqual(annotationsLevels.severityLOWconfidenceLOW)
  })
})
