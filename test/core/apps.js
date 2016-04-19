/* global describe, it */
require('dotenv').load()

var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var request = require('superagent')
var path = require('path')
var fs = require('fs')

var s = 1000 // seconds

const URL = 'https://localhost:' + process.env.SECURE_PORT + '/api'

const APPS_DIR = process.env.APPS_DIR
const GITHUB_REPO = 'https://github.com/netbeast/get-started'

// Test styling
// http://chaijs.com/guide/styles/

// tutorial
// http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018

describe('Apps', function () {
  it('should upload myapp to the dashboard', function (done) {
    this.timeout(8 * s) // this takes time
    var app = path.join(__dirname, '../app.tar.gz')
    request.post(URL + '/apps')
      .attach('file', app, 'app.tar.gz')
      .end(function (err, resp) {
        expect(err).to.not.exist
        fs.stat(path.join(APPS_DIR, 'myapp'), function (err, stats) {
          should.not.exist(err)
          expect(stats.isDirectory()).to.equal(true)
          done()
        })
      })
  })

  it('should return application package.json', function (done) {
    request(URL + '/apps/myapp').end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      expect(resp.body).to.be.an('Object')
      done()
    })
  })

  it('should upload app from github to the dashboard', function (done) {
    this.timeout(20 * s) // this also takes time
    request.post(URL + '/apps')
    .send({ url: GITHUB_REPO })
    .end(function (err, resp, body) {
      should.not.exist(err)
      expect(resp.statusCode).to.equal(200)
      fs.stat(path.join(APPS_DIR, 'get-started'), function (err, stats) {
        should.not.exist(err)
        expect(stats.isDirectory()).to.equal(true)
        done()
      })
    })
  })

  it("should return all apps' package.json", function (done) {
    request(URL + '/apps').end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      expect(resp.body).to.be.an('Array')
      done()
    })
  })

  it("should remove 'myapp' from repository", function (done) {
    request.del(URL + '/apps/myapp').end(function (err, resp, body) {
      should.not.exist(err)
      expect(resp.statusCode).to.equal(204)
      done()
    })
  })

  it("should remove 'get-started' from repository", function (done) {
    request.del(URL + '/apps/get-started').end(function (err, resp, body) {
      should.not.exist(err)
      expect(resp.statusCode).to.equal(204)
      done()
    })
  })

  it('should return 404 when an app does not exist', function (done) {
    request.del(URL + '/apps/non-existing-app').end(function (err, resp, body) {
      expect(err.status).to.equal(404)
      expect(resp.statusCode).to.equal(404)
      done()
    })
  })
})
