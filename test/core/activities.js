/* global describe, before, after, it */
require('dotenv').load()

var chai = require('chai')
var expect = chai.expect

var request = require('superagent')
var fs = require('fs-extra')
var path = require('path')

const URL = 'https://localhost:' + process.env.SECURE_PORT + '/api'

const APPS_DIR = process.env.APPS_DIR
const GITHUB_REPO = 'https://github.com/netbeast/get-started'

describe('Activities', function () {
  before('should install get-started from github', function (done) {
    this.timeout(20000) // this also takes time
    request.post(URL + '/apps')
    .send({ url: GITHUB_REPO })
    .end(function (err, resp) {
      if (err) throw err
      expect(resp.statusCode).to.equal(200)
      fs.stat(path.join(APPS_DIR, 'get-started'), function (err, stats) {
        if (err) throw err
        expect(stats.isDirectory()).to.equal(true)
        done()
      })
    })
  })

  after('it should remove get-started', function (done) {
    fs.remove(path.join(process.env.APPS_DIR, 'get-started'), function (err) {
      if (err) throw err
      done()
    })
  })

  it('should show no apps running', function (done) {
    request(URL + '/activities/').end(function (err, resp, body) {
      if (err) throw err
      resp.statusCode.should.equal(200)
      body = resp.body.filter(function (app) {
        return app.netbeast && app.netbeast.type !== 'plugin' && !app.netbeast.bootOnLoad
      })
      body.should.have.length.below(1)
      done()
    })
  })

  it('should start correctly get-started', function (done) {
    request.post(URL + '/activities/get-started').end(function (err, resp, body) {
      if (err) throw err
      resp.statusCode.should.equal(200)
      done()
    })
  })

  it('get-started should be running', function (done) {
    request(URL + '/activities/get-started').end(function (err, resp, body) {
      if (err) throw err
      resp.statusCode.should.equal(200) // app is running
      done()
    })
  })
})
