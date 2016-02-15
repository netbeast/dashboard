/* global describe, it */
require('dotenv').load()

var chai = require('chai')
var should = chai.should()

var request = require('request')
var async = require('async')

const URL = 'http://localhost:' + process.env.PORT + '/api/i/test-app'
const METHODS = ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']

describe.skip('Proxy', function () {
  it('it should perform all requests methods correctly', function (done) {
    async.map(METHODS, function (method, cb) {
      request({ method: method, url: URL }, function (err, resp) {
        should.not.exist(err)
        resp.statusCode.should.equal(200)
        cb()
      })
    }, done)
  })
})
