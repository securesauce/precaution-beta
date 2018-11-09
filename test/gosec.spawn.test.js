// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const gosec = require('../gosec/gosec')

describe('Spawn gosec tests', () => {
    test('Empty input for gosec', () => {
        const results = gosec('')
        expect(results).toBeFalsy()
    })

   test('Run gosec on a go file without security problems', () => {
        const results = gosec('../fixtures/go/secure_go_files')
        expect(results.Issues).toBeFalsy()
    })

    test('Run gosec on go problematic file', async () => {
        const results = await gosec('./fixtures/go/bad_files/badTestFile.go')
        console.log("Results are: ", results)
        expect(results.Stats.found).toBeGreaterThan(0)
    })
})