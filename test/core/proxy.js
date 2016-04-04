/* global describe, it */
require('dotenv').load()

var request = require('superagent-bluebird-promise')
var Promise = require('bluebird')

const URL = 'http://localhost:' + process.env.PORT + '/api/i/test-app'
const METHODS = ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']

describe.skip('Proxy', function () {
  it('it should perform all requests methods correctly', function (done) {
    Promise.each(METHODS, function (method) {
      return request({ method: method, url: URL }).promise()
    }).then(done.bind(this, undefined))
  })
})
