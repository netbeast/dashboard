/* global describe, before, after, it */
require('dotenv').load()

var chai = require('chai')
var should = chai.should()

var request = require('superagent')
var fs = require('fs-extra')
var path = require('path')

var App = require('src/models/app')

const URL = 'https://localhost:' + process.env.SECURE_PORT + '/api'

const APP_PATH = './test/app.tar.gz'

describe('Activities', function () {
  before('it should install myapp for tests', function (done) {
    fs.copy(APP_PATH + '.bck', APP_PATH, function (err) {
      should.not.exist(err)
      App.install(APP_PATH, function (err) {
        should.not.exist(err)
        done()
      })
    })
  })

  after('it should remove myapp', function (done) {
    fs.remove(path.join(process.env.APPS_DIR, 'myapp'), function (err) {
      should.not.exist(err)
      fs.copy(APP_PATH + '.bck', APP_PATH, function (err) {
        should.not.exist(err)
        done()
      })
    })
  })

  it('should show no apps running', function (done) {
    request(URL + '/activities/').end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      body = resp.body.filter(function (app) {
        return app.netbeast && app.netbeast.type !== 'plugin' && !app.netbeast.bootOnLoad
      })
      body.should.have.length.below(1)
      done()
    })
  })

  it('should start correctly myapp', function (done) {
    request.post(URL + '/activities/myapp').end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      done()
    })
  })

  it('myapp should be running', function (done) {
    request(URL + '/activities/myapp').end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200) // app is running
      done()
    })
  })
})
