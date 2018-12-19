// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')
const path = require('path')

const { Application } = require('probot')
const linterApp = require('..')
const { config } = require('../config')

const checkSuiteRerequestedEvent = require('./events/check_suite.rerequested.json')
const pullRequestOpenedEvent = require('./events/pull_request.opened.json')

const samplePythonPRFixture = require('./fixtures/pull_request.files.python.json')
const sampleMixedPRFixture = require('./fixtures/pull_request.files.mix.json')
const simplePRFixture = require('./fixtures/pull_request.files.modified.json')
const fileCreatedPRFixture = require('./fixtures/pull_request.files.added.json')

const fileNotFoundResponse = require('./fixtures/github/getContent.response.missing.json')

function mockPRContents (github, PR) {
  github.pullRequests.listFiles = jest.fn().mockResolvedValue(PR)
}

describe('Bandit-linter', () => {
  let app, github
  let mockFiles = {}
  let fileRefs = {}

  beforeAll(() => {
    // Load all python files in the fixture directories and map names to contents in mock object
    const files = fs.readdirSync('test/fixtures/python', { encoding: 'utf8' })
    files.forEach((filename) => {
      mockFiles[filename] = fs.readFileSync(path.join('test/fixtures/python', filename), 'utf8')
    })

    fileRefs['head_ref'] = mockFiles['key_sizes.py']
    fileRefs['base_ref'] = mockFiles['key_sizes.old.py']
  })

  beforeEach(() => {
    app = new Application()
    app.load(linterApp)

    // Setup the default mocks for API calls
    github = {
      checks: {
        create: jest.fn().mockResolvedValue({ data: { id: 1 } }),
        update: jest.fn().mockResolvedValue({})
      },
      pullRequests: {
        listFiles: jest.fn().mockResolvedValue(samplePythonPRFixture)
      },
      repos: {
        getContents: jest.fn(({ path }) => {
          if (mockFiles.hasOwnProperty(path)) {
            return Promise.resolve({ data: mockFiles[path] })
          } else {
            throw Error(path + ' fixture does not exist')
          }
        })
      }
    }
    app.auth = () => Promise.resolve(github)
  })

  afterAll(() => {
    fs.remove('test/fixtures/python/bandit.json')
  })

  describe('interacts with the Checks API', () => {
    test('responds to the requesting checks event', async () => {
      await app.receive(checkSuiteRerequestedEvent)

      expect(github.checks.create).toHaveBeenCalledWith(expect.objectContaining({
        status: 'in_progress',
        owner: 'owner_login',
        repo: 'repo_name',
        started_at: expect.any(String),
        head_sha: expect.any(String)
      }))

      expect(github.pullRequests.listFiles).toHaveBeenCalledWith({
        owner: 'owner_login',
        repo: 'repo_name',
        number: 6
      })

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        check_run_id: 1,
        status: 'completed',
        conclusion: 'failure',
        owner: 'owner_login',
        repo: 'repo_name',
        completed_at: expect.any(String)
      }))
    })

    test('responds to the opened PR event', async () => {
      await app.receive(pullRequestOpenedEvent)

      expect(github.checks.create).toHaveBeenCalledWith(expect.objectContaining({
        status: 'in_progress',
        owner: 'owner_login',
        repo: 'repo_name',
        started_at: expect.any(String),
        head_sha: expect.any(String)
      }))

      expect(github.pullRequests.listFiles).toHaveBeenCalledWith({
        owner: 'owner_login',
        repo: 'repo_name',
        number: 8
      })

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        check_run_id: 1,
        status: 'completed',
        owner: 'owner_login',
        repo: 'repo_name',
        completed_at: expect.any(String)
      }))
    })

    test('handles PRs with mixed file types', async () => {
      // Manually load in the go file contents
      mockFiles['networking_binding.go'] = fs.readFileSync('test/fixtures/go/src/multiple_bad_files/networking_binding.go', 'utf8')
      mockFiles['bad_test_file.go'] = fs.readFileSync('test/fixtures/go/src/multiple_bad_files/bad_test_file.go', 'utf8')

      mockPRContents(github, sampleMixedPRFixture)

      await app.receive(pullRequestOpenedEvent)

      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'https.py'
      }))
      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'networking_binding.go'
      }))
      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'AbstractJavaFileFactoryServiceProvider.java'
      }))
      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'executable'
      }))
    })

    test('does not report baseline errors', async () => {
      mockPRContents(github, simplePRFixture)
      github.repos.getContents = jest.fn(({ ref }) => Promise.resolve({ data: fileRefs[ref] }))

      const previousConfig = config.compareAgainstBaseline
      config.compareAgainstBaseline = true

      await app.receive(pullRequestOpenedEvent)

      config.compareAgainstBaseline = previousConfig

      // Is there a better way to do this?

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        output: expect.objectContaining({
          annotations: expect.arrayContaining([
            expect.objectContaining({
              start_line: 5
            }),
            expect.objectContaining({
              start_line: 8
            })
          ])
        })
      }))

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        output: expect.objectContaining({
          annotations: expect.not.arrayContaining([
            expect.objectContaining({
              start_line: 13
            }),
            expect.objectContaining({
              start_line: 16
            })
          ])
        })
      }))
    })

    test('does not download base version of new files', async () => {
      mockPRContents(github, fileCreatedPRFixture)

      // Simulate newly created file: return contents on head ref, error on base ref
      github.repos.getContents = jest.fn(({ ref, path }) => {
        if (ref === 'head') {
          return mockFiles[path]
        } else {
          return fileNotFoundResponse
        }
      })

      await app.receive(pullRequestOpenedEvent)

      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        ref: 'head_ref'
      }))
      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        ref: 'base_ref'
      }))
    })

    test('cleans up after performing checks', async () => {
      await app.receive(checkSuiteRerequestedEvent)

      expect(fs.existsSync('cache/210857942')).toBeFalsy()
    })

    test('sends an error report on crash', async () => {
      github.pullRequests.listFiles = jest.fn().mockRejectedValue('Rejected promise')

      await app.receive(checkSuiteRerequestedEvent)

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        check_run_id: 1,
        status: 'completed',
        conclusion: 'failure',
        output: expect.objectContaining({
          title: 'App error',
          summary: 'Rejected promise'
        })
      }))
    })
  })
})
