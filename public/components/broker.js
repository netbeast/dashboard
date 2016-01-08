/* global angular, toastr*/

// Broker.js is an instance for socket.io
// that logs messages to refactor code

var mqtt = require('mqtt')
var client = mqtt.connect()

angular.module('Dashboard')
.run(function () {
  client.subscribe('netbeast/push')
  client.on('message', handle)
})

function handle (topic, msg) {
  console.log('mqtt://news ->', msg.toString())
  msg = JSON.parse(msg.toString())
  if (msg.emphasis) {
    toastr[msg.emphasis](msg.body.toString(), msg.title)
  } else {
    toastr.info(msg.body, msg.title)
  }
}
