/* global describe, it, before, after */

// File to unit tests web sockets
// jesus@netbeast.co

var crypto = require('crypto')

var io = require('socket.io-client')
var chai = require('chai')
var expect = chai.expect

var broker = require('src/helpers/broker')
var config = require('config')

const TEST_ERR_MSG_BODY = crypto.createHash('sha1')
.update(Math.random().toString())
.digest('hex')

const TEST_WARN_MSG_BODY = crypto.createHash('sha1')
.update(Math.random().toString())
.digest('hex')

console.log('### %s ###', config.LOCAL_URL)

var socket

describe('Broker', function () {
  before('should connect to Netbeast', function (done) {
    socket = io.connect(config.LOCAL_URL, { 'force new connection': true })
    socket.on('connect', done)
  })

  after('should close socket', function () {
    socket.close()
  })

  it('should emit a warning', function (done) {
    socket.on('news', function (notification) {
      if (notification.body === TEST_WARN_MSG_BODY) {
        expect(notification.emphasis).to.exist
        expect(notification.emphasis).to.equal('warning')
        done()
      }
    })
    broker.warning(TEST_WARN_MSG_BODY)
  })

  it('should emit an error', function (done) {
    socket.on('news', function (notification) {
      if (notification.body === TEST_ERR_MSG_BODY) {
        expect(notification.emphasis).to.exist
        expect(notification.emphasis).to.equal('error')
        done()
      }
    })
    broker.error(TEST_ERR_MSG_BODY)
  })
})
