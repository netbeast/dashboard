/* global describe it */

// File to unit tests web sockets
// jesus@netbeast.co

var broker = require('src/helpers/broker')
var io = require('socket.io-client')
var config = require('config')

const TEST_MSG_BODY = 'testing code/broker.js'

var socket = io.connect(config.LOCAL_URL)

describe('Web sockets broker', function () {
  it.skip('should connect to Netbeast', function (done) {
    console.log(config.LOCAL_URL)
    socket.on('connect', function () {
      console.log('ws:// connected')
      done()
    })
  })

  it.skip('should emit a warning', function (done) {
    broker.warning(TEST_MSG_BODY)
    socket.on('news', function (notification) {
      console.log(notification)
      if (notification.body === TEST_MSG_BODY) {
        notification.emphasis.should.equal('warning')
        done()
      }
    })
  })

  it.skip('should emit an error', function (done) {
    broker.error('this is a test error')
    socket.on('news', function (notification) {
      console.log(notification)
      if (notification.body === TEST_MSG_BODY) {
        notification.emphasis.should.equal('error')
        done()
      }
    })
  })
})
