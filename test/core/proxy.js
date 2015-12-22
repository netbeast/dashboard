#!/usr/bin/env node
/* global describe, it, before, after */
var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var request = require('request')
var async = require('async')

var io = require('socket.io-client')
var config = require('config')

const URL = config.LOCAL_URL + '/i/test-app'
const METHODS = ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
const TEST_MSG_BODY = 'testing websockets on proxy'

var socket_tx, socket_rx

describe.skip('Proxy', function () {
  before('have sockets connected', function (done) {
    var n_connected = 0
    socket_tx = io.connect(URL, { 'force new connection': true })
    socket_rx = io.connect(URL, { 'force new connection': true })
    socket_rx.on('connect', callback)
    socket_tx.on('connect', callback)
    function callback () {
      n_connected++
      if (n_connected === 2) done()
    }
  })

  after('close such sockets', function () {
    socket_rx.close()
    socket_tx.close()
  })

  it('it should perform all requests methods correctly', function (done) {
    async.map(METHODS, function (method, cb) {
      request({ method: method, url: URL }, function (err, resp) {
        should.not.exist(err)
        resp.statusCode.should.equal(200)
        cb()
      })
    }, done)
  })

  it('it should be able to communicate via websockets', function (done) {
    socket_rx.on('message', function (msg) {
      expect(msg).to.equal(TEST_MSG_BODY)
      done()
    })

    socket_tx.emit('message', TEST_MSG_BODY)
  })
})
