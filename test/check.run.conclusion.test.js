// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { getConclusion } = require('../github_api_helper')

describe('Check run conclusions tests', () => {
  test('Empty annotations', () => {
    const trueConclusion = getConclusion([])
    expect(trueConclusion).toEqual('success')
  })

  test('Undefined annotations', () => {
    const trueConclusion = getConclusion('undefined')
    expect(trueConclusion).toEqual('success')
  })

  test('Mixed annotation levels', () => {
    const { annotations } = require('./fixtures/annotations/mixed_levels_annotations.json')
    const trueConclusion = getConclusion(annotations)
    expect(trueConclusion).toEqual('failure')
  })

  test('Warning and neutral annotations', () => {
    const { annotations } = require('./fixtures/annotations/warning_neutral_annotations.json')
    const trueConclusion = getConclusion(annotations)
    expect(trueConclusion).toEqual('neutral')
  })

  test('Neutral annotations', () => {
    const { annotations } = require('./fixtures/annotations/neutral_annotations.json')
    const trueConclusion = getConclusion(annotations)
    expect(trueConclusion).toEqual('success')
  })
})
