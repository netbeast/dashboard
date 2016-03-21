/* global describe, after, it*/
require('dotenv').load()

var should = require('chai').should()

var path = require('path')
var exec = require('child_process').exec

var fs = require('fs-extra')
var async = require('async')

const CLI = path.join(process.cwd(), 'bin', 'cli.js')
const PATH_TO_APP = './test-app'
const INSTALLED_APP = '.sandbox/myapp'

describe('Client', function () {
  after('Should remove test-app', function () {
    fs.removeSync(INSTALLED_APP)
    fs.removeSync(PATH_TO_APP)
  })

  it('should create an app called test-app', function (done) {
    async.series([
      async.apply(exec, CLI + ' new test-app'),
      async.apply(fs.readdir, PATH_TO_APP),
      async.apply(fs.readdir, PATH_TO_APP + '/public'),
      function (callback) {
        fs.readFile(PATH_TO_APP + '/server.js', function (err, data) {
          if (err) return callback(err)
          data = data.toString()
          var shebang = data.slice(0, data.indexOf('\n'))
          shebang.should.equal('#!/usr/bin/env node')
          callback(null, data)
        })
      },
      function (callback) {
        fs.readJson(PATH_TO_APP + '/package.json', function (err, data) {
          if (err) return callback(err)
          fs.access(PATH_TO_APP + '/' + data.main, fs.X_OK, callback)
        })
      }
    ],
    function (err, results) {
      should.not.exist(err)
      should.exist(results)
      done()
    })
  })

  it('should install test/app.tar.gz', function (done) {
    this.timeout(25000)
    exec(CLI + ' install test/app.tar.gz ' + 'http://localhost:' + process.env.PORT,
    function (err, stdout, stderr) {
      should.not.exist(err)
      fs.access('./.sandbox/myapp', fs.F_OK, function (err) {
        should.not.exist(err)
        done()
      })
    })
  })

  it('should package test-app into app.tar.gz', function (done) {
    exec(CLI + ' package test-app', function (err, stdout, stderr) {
      should.not.exist(err)
      fs.access('app.tar.gz', fs.F_OK, function (err) {
        should.not.exist(err)
        fs.removeSync('app.tar.gz')
        done()
      })
    })
  })

  // package app with option --to (alias -o)
  it('should create a packaged app from test-app called test-app.tar.gz (option --to)', function (done) {
    exec(CLI + ' package test-app --to test-app__to.tar.gz', function (err, stdout, stderr) {
      should.not.exist(err)
      fs.access('test-app__to.tar.gz', fs.F_OK, function (err) {
        should.not.exist(err)
        done()
      })
    })
  })

  // unpkg option --to
  it('should test-app.tar.gz unpackage to ./test-app folder (option --to)', function (done) {
    exec(CLI + ' unpkg test-app__to.tar.gz --to test-app__to', function (err, stdout, stderr) {
      should.not.exist(err)
      fs.access('test-app__to', fs.F_OK, function (err) {
        should.not.exist(err)
        fs.removeSync('test-app__to')
        fs.removeSync('test-app__to.tar.gz')
        done()
      })
    })
  })
})
