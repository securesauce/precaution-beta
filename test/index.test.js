// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')

const { Application } = require('probot')
const linterApp = require('..')

const checkSuiteRerequestedEvent = require('./events/check_suite.rerequested.json')
const pullRequestOpenedEvent = require('./events/pull_request.opened.json')

const pullRequestFiles = require('./fixtures/pull_request.files.json')
const multipleTypesFixture = require('./fixtures/pull_request.files.2.json')
const simplePRFixture = require('./fixtures/pull_request.files.3.json')

describe('Bandit-linter', () => {
  let app, github
  let mockFiles = {}
  let fileRefs = {}

  beforeAll(() => {
    mockFiles['examples/httplib_https.py'] = fs.readFileSync('test/fixtures/python/https.py', 'utf8')
    mockFiles['examples/httpoxy_cgihandler.py'] = fs.readFileSync('test/fixtures/python/cgi.py', 'utf8')
    mockFiles['examples/httpoxy_twisted_directory.py'] = fs.readFileSync('test/fixtures/python/twisted_dir.py', 'utf8')
    mockFiles['examples/httpoxy_twisted_script.py'] = fs.readFileSync('test/fixtures/python/twisted_script.py', 'utf8')

    fileRefs['head_ref'] = fs.readFileSync('test/fixtures/python/key_sizes.py', 'utf8')
    fileRefs['base_ref'] = fs.readFileSync('test/fixtures/python/key_sizes.old.py', 'utf8')
  })

  beforeEach(() => {
    app = new Application()
    app.load(linterApp)

    github = {
      checks: {
        create: jest.fn().mockResolvedValue({ data: { id: 1 } }),
        update: jest.fn().mockResolvedValue({})
      },
      pullRequests: {
        getFiles: jest.fn().mockResolvedValue(pullRequestFiles)
      },
      repos: {
        getContent: jest.fn(({ path }) => Promise.resolve({ data: mockFiles[path] }))
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

      expect(github.pullRequests.getFiles).toHaveBeenCalledWith({
        owner: 'owner_login',
        repo: 'repo_name',
        number: 6
      })
      // expect(github.repos.getContent).toHaveBeenCalledTimes(4)

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        check_run_id: 1,
        status: 'completed',
        conclusion: 'success',
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

      expect(github.pullRequests.getFiles).toHaveBeenCalledWith({
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

    test('downloads only necessary files', async () => {
      github.pullRequests.getFiles = jest.fn().mockResolvedValue(multipleTypesFixture)

      await app.receive(pullRequestOpenedEvent)

      expect(github.repos.getContent).toHaveBeenCalledWith(expect.objectContaining({
        path: 'pythonFile1.py'
      }))
      expect(github.repos.getContent).toHaveBeenCalledWith(expect.objectContaining({
        path: 'pythonFile2.py'
      }))
      expect(github.repos.getContent).toHaveBeenCalledWith(expect.objectContaining({
        path: 'goFile1.go'
      }))
      expect(github.repos.getContent).toHaveBeenCalledWith(expect.objectContaining({
        path: 'goFile2.go'
      }))
      expect(github.repos.getContent).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'AbstractJavaFileFactoryServiceProvider.java'
      }))
      expect(github.repos.getContent).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'executable'
      }))
    })

    test('does not report baseline errors', async () => {
      github.pullRequests.getFiles = jest.fn().mockResolvedValue(simplePRFixture)
      github.repos.getContent = jest.fn(({ ref }) => Promise.resolve({ data: fileRefs[ref] }))

      await app.receive(pullRequestOpenedEvent)

      // Is there a better way to do this?

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        output: expect.objectContaining({
          annotations: expect.arrayContaining([
            expect.objectContaining({
              start_line: 5,
              end_line: 6
            }),
            expect.objectContaining({
              start_line: 8,
              end_line: 10
            })
          ])
        })
      }))

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        output: expect.objectContaining({
          annotations: expect.not.arrayContaining([
            expect.objectContaining({
              start_line: 13,
              end_line: 14
            }),
            expect.objectContaining({
              start_line: 16,
              end_line: 18
            })
          ])
        })
      }))
    })

    test('cleans up after performing checks', async () => {
      await app.receive(checkSuiteRerequestedEvent)

      expect(fs.existsSync('cache/210857942')).toBeFalsy()
    })

    test('sends an error report on crash', async () => {
      github.pullRequests.getFiles = jest.fn().mockRejectedValue('Rejected promise')

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

      github.pullRequests.getFiles = jest.fn(() => { throw new Error('Unhandled error') })

      await app.receive(checkSuiteRerequestedEvent)

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        check_run_id: 1,
        status: 'completed',
        conclusion: 'failure',
        output: expect.objectContaining({
          title: 'App error',
          summary: 'Error: Unhandled error'
        })
      }))
    })
  })
})
