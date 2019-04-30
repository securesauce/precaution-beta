// Copyright 2019 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const fs = require('fs-extra')
const path = require('path')

const { Application } = require('probot')
const linterApp = require('..')
const { config } = require('../config')

const checkSuiteRerequestedEvent = require('./events/check_suite.rerequested.json')
const checkRunRerequestEvent = require('./events/check_run_rerequested.json')
const pullRequestOpenedEvent = require('./events/pull_request.opened.json')
const pullRequestSynchronize = require('./events/pull_request.synchronize.json')

const sampleMixedPRFixture = require('./fixtures/pull_request.files.mix.json')
const samplePythonPRFixture = require('./fixtures/pull_request.files.python.json')
const sampleSafePRFixture = require('./fixtures/pull_request.files.safe.json')
const sampleOnlyDeletions = require('./fixtures/pull_request.deletions.json')
const sampleDelAddModif = require('./fixtures/pull_request.deletions.modif.add.json')

function mockPRContents (github, pr) {
  github.pullRequests.listFiles = jest.fn(() => {
    --github.numPagesOfContent
    return pr
  })
  github.getNextPage = github.pullRequests.listFiles
}

describe('Precaution workflow', () => {
  let app, github
  let mockFiles = {}

  beforeAll(() => {
    // Load all python files in the fixture directories and map names to contents in mock object
    const files = fs.readdirSync('test/fixtures/python', { encoding: 'utf8' })
    files.forEach((filename) => {
      mockFiles[filename] = fs.readFileSync(path.join('test/fixtures/python', filename), 'utf8')
    })

    // Manually load in the go file contents
    mockFiles['networking_binding.go'] = fs.readFileSync('test/fixtures/go/src/vulnerable_package/networking_binding.go', 'utf8')
    mockFiles['bad_test_file.go'] = fs.readFileSync('test/fixtures/go/src/vulnerable_package/bad_test_file.go', 'utf8')
    mockFiles['hello.go'] = fs.readFileSync('test/fixtures/go/src/safe/hello_world.go', 'utf8')
    // Mock the files as empty strings because we don't analyze their content anyway
    mockFiles['vulnerable.js'] = ''
    mockFiles['vulnerable.ts'] = ''
    mockFiles[config.configFilePath] = fs.readFileSync('test/fixtures/config_files/sample_config.yaml', 'utf8')
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
      numPagesOfContent: 1,
      pullRequests: {
        listFiles: jest.fn(() => {
          --github.numPagesOfContent
          return samplePythonPRFixture
        })
      },
      hasNextPage: jest.fn(() => github.numPagesOfContent > 0),
      getNextPage: jest.fn(() => {
        --github.numPagesOfContent
        return samplePythonPRFixture
      }),
      repos: {
        getContents: jest.fn(({ path }) => {
          if (mockFiles.hasOwnProperty(path)) {
            return Promise.resolve({ data: mockFiles[path] })
          } else {
            let error = new Error(path + ' fixture does not exist')
            error.code = 404
            throw error
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
        number: 6,
        per_page: config.numFilesPerPage
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

    test('Check run rerequest event', async () => {
      await app.receive(checkRunRerequestEvent)

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
        number: 6,
        per_page: config.numFilesPerPage
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
        number: 8,
        per_page: config.numFilesPerPage
      })

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        check_run_id: 1,
        status: 'completed',
        owner: 'owner_login',
        repo: 'repo_name',
        completed_at: expect.any(String)
      }))
    })

    // This event happens when there is an already opened pull request which
    // happens across forks. Then, new commit to this pull request will cause
    // a pull_request.synchronize event.
    test('responds on pull request synchronize event', async () => {
      await app.receive(pullRequestSynchronize)

      expect(github.checks.create).toHaveBeenCalledWith(expect.objectContaining({
        status: 'in_progress',
        owner: 'original_repo_owner',
        repo: 'original_repo_name',
        started_at: expect.any(String),
        head_sha: expect.any(String)
      }))

      expect(github.pullRequests.listFiles).toHaveBeenCalledWith({
        owner: 'original_repo_owner',
        repo: 'original_repo_name',
        number: 8,
        per_page: config.numFilesPerPage
      })

      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        owner: 'forked_repo_owner',
        repo: 'forked_repo_name',
        ref: 'head_ref'
      }))

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        status: 'completed',
        owner: 'original_repo_owner',
        repo: 'original_repo_name',
        completed_at: expect.any(String)
      }))
    })

    test('handles PRs with mixed file types', async () => {
      mockPRContents(github, sampleMixedPRFixture)
      await app.receive(pullRequestOpenedEvent)

      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'https.py'
      }))
      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'networking_binding.go'
      }))
      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'vulnerable.js'
      }))
      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'vulnerable.ts'
      }))
      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'AbstractJavaFileFactoryServiceProvider.java'
      }))
      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'executable'
      }))
    })

    test('handles PRs with only deletions', async () => {
      mockPRContents(github, sampleOnlyDeletions)
      await app.receive(pullRequestOpenedEvent)

      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'https.py'
      }))
      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'cgi.py'
      }))
      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'hello.go'
      }))

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        check_run_id: 1,
        status: 'completed',
        conclusion: 'success',
        owner: 'owner_login',
        repo: 'repo_name',
        completed_at: expect.any(String)
      }))
    })

    test('send many annotations through multiple API calls', () => {
      const { sendResults } = require('../github_api_helper')
      let context = {
        github: {
          checks: {
            update: jest.fn().mockResolvedValue({})
          }
        },
        repo: jest.fn().mockResolvedValue({
          owner: 'owner_login',
          repo: 'repo_name'
        })
      }
      let { annotations } = require('./fixtures/annotations/mixed_levels_annotations.json')
      let output = {
        title: '',
        summary: '',
        annotations,
        text: ''
      }
      sendResults(context, 1000, output, 2)

      expect(context.github.checks.update).toHaveBeenCalledTimes(2)
    })

    test('handles PRs with deletions, modifications and additions', async () => {
      mockPRContents(github, sampleDelAddModif)
      await app.receive(pullRequestOpenedEvent)

      expect(github.repos.getContents).not.toHaveBeenCalledWith(expect.objectContaining({
        path: 'https.py'
      }))
      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'cgi.py'
      }))
      expect(github.repos.getContents).toHaveBeenCalledWith(expect.objectContaining({
        path: 'hello.go'
      }))
    })

    test('handles paging through the GitHub API', async () => {
      github.numPagesOfContent = 2
      await app.receive(pullRequestOpenedEvent)

      expect(github.hasNextPage).toHaveBeenCalledTimes(2)
      expect(github.getNextPage).toHaveBeenCalledTimes(1)

      const expectedRes = {
        'data':
          [
            { 'filename': 'https.py', 'status': 'added' },
            { 'filename': 'cgi.py', 'status': 'added' },
            { 'filename': 'twisted_dir.py', 'status': 'added' },
            { 'filename': 'twisted_script.py', 'status': 'added' }
          ]
      }
      expect(github.getNextPage).toHaveNthReturnedWith(1, expectedRes)
      expect(github.pullRequests.listFiles).toHaveNthReturnedWith(1, expectedRes)
    })

    test('cleans up after performing checks', async () => {
      await app.receive(checkSuiteRerequestedEvent)

      expect(fs.existsSync('cache/54321/2108')).toBeFalsy()
    })

    test('sends a success status on safe code', async () => {
      mockPRContents(github, sampleSafePRFixture)
      await app.receive(pullRequestOpenedEvent)

      expect(github.checks.update).toHaveBeenCalledWith(expect.objectContaining({
        status: 'completed',
        conclusion: 'success'
      }))
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
