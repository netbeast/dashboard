/* global describe it */

// File to unit tests web sockets
// jesus@netbeast.co

var io = require('socket.io-client')

var config = require('config')

describe('Web sockets', function () {
  it('should connect to websocket server', function () {
    io.connect(config.LOCAL_URL)
  })
})
