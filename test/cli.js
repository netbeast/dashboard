/* global describe, after, it*/
require('dotenv').load()

var exec = require('child_process').exec

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))

const PATH_TO_APP = 'test-app'
const INSTALLED_APP = '_apps/myapp'

describe('Client', function () {
  after('Should remove test-app', function () {
    fs.removeSync(INSTALLED_APP)
    fs.removeSync(PATH_TO_APP)
  })

  it('should create an app called test-app', function (done) {
    new Promise(function (resolve, reject) {
      exec('netbeast new test-app', function (err, stdout, stderr) {
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
    // .then(function (data) {
    //   return fs.accessAsync(PATH_TO_APP + '/' + data.main, fs.X_OK)
    // })
    .then(() => done())
  })
})
