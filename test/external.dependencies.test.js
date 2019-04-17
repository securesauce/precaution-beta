// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { config } = require('../config')
const { jsRules } = require('../tslint/tslint.json')

const request = require('request')
const cheerio = require('cheerio')

describe('Checks for documentation websites', () => {
  test('Check if TSLint plugin documentation website is online', async () => {
    request(config.tslintProjectWebsite, async (err, response, _) => {
      if (err) {
        throw new Error(err)
      }
      expect(response.statusCode === 200 || response.statusCode === 201).toBeTruthy()
    })
  })

  test('Check documentation for every rule on the TSLint plugin webpage', async () => {
    const rules = Object.keys(jsRules)
    request(config.tslintProjectWebsite, (err, _, body) => {
      if (err) {
        throw new Error(err)
      }
      let $ = cheerio.load(body)
      let result = ''
      for (let ruleName of rules) {
        result = $('#user-content-' + ruleName).attr('href')
        expect(result).toEqual('#' + ruleName)
      }
    })
  })
})
