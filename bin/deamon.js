#!/usr/bin/env node

var dgram = require('dgram')
var deamon = dgram.createSocket('udp4')

// aurum number port
deamon.bind(16180, function () {
  deamon.addMembership('239.0.16.18')
})

deamon.on('listening', function () {
  var addr = deamon.address()
  console.log('deamon ready at %s:%s', addr.address, addr.port)
})

deamon.on('message', function (msg, req) {
  console.log('%s from %s:%s', msg, req.address, req.port)
  // answer from the interface we got the request
  var message = new Buffer(process.env.NETBEAST_PORT)
  deamon.send(message, 0, message.length, req.port, req.address, function (err, bytes) {
    if (err) throw err
    console.log('UDP message sent to ' + req.address + ':' + req.port)
  })
})
