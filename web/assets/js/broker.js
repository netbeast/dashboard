/* global angular, toastr*/

// Broker.js is an instance for socket.io
// that logs messages to refactor code

var io = require('socket.io-client')
var socket = io.connect()

angular.module('Dashboard')
.run(function () {
  socket.on('connect', function () {
    console.log('ws:// connection stablished')
  })

  socket.on('disconnect', function () {
    console.log('ws:// connection lost')
  })

  socket.on('news', handle)
})

function handle (msg) {
  console.log('ws://news')
  console.log('msg')
  switch (msg.emphasis) {
    case 'error':
    case 'warning':
    case 'success':
      toastr[msg.emphasis](msg.body.toString(), msg.title)
      break
    default:
      toastr.info(msg.body, msg.title)
  }
}
