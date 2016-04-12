/* global describe, after, it*/
require('dotenv').load()

var should = require('chai').should()

var path = require('path')
var exec = require('child_process').exec

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))

const CLI = path.join(process.cwd(), 'bin', 'cli.js')
const PATH_TO_APP = './test-app'
const INSTALLED_APP = '.sandbox/myapp'

describe('Client', function () {
  after('Should remove test-app', function () {
    fs.removeSync(INSTALLED_APP)
    fs.removeSync(PATH_TO_APP)
  })

  it('should create an app called test-app', function (done) {
    new Promise(function (resolve, reject) {
      exec(CLI + ' new test-app', function (err, stdout, stderr) {
        if (err) return reject(err)
        else return resolve(PATH_TO_APP)
      })
    })
    .then(fs.readdirAsync)
    .then(fs.readFileAsync.bind(fs, PATH_TO_APP + '/server.js'))
    .then(function (data) {
      var shebang = data.toString().slice(0, data.toString().indexOf('\n'))
      shebang.should.equal('#!/usr/bin/env node')
      return Promise.resolve()
    })
    .then(fs.readJsonAsync.bind(fs, PATH_TO_APP + '/package.json'))
    .then(function (data) {
      return fs.accessAsync(PATH_TO_APP + '/' + data.main, fs.X_OK)
    })
    .then(done)
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
      fs.access('netbeast-app.tar.gz', fs.F_OK, function (err) {
        should.not.exist(err)
        fs.removeSync('netbeast-app.tar.gz')
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
