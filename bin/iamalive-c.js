#!/usr/bin/env node

var dgram = require('dgram')
var client = dgram.createSocket('udp4')
var tunnel = require('./tunnel-c.js')

console.log('Server ' + process.env.SERVER_IP + ':' + process.env.IAMALIVE_SPORT)

var intervalID = setInterval(function () {
  require('getmac').getMac(function (err, macAddress) {
    if (err) throw err
    var msg = new Buffer(macAddress)
    client.send(msg, 0, msg.length, process.env.IAMALIVE_SPORT, process.env.SERVER_IP, function (err) {
      if (err) {
        throw err
      }
      // client.close()
    })
  })
}, 1000)

client.on('message', function (msg, rinfo) {
  var remotePort = msg.toString()
  console.log('client got: ' + remotePort + ' from ' + rinfo.address + ':' + rinfo.port)
  if (parseInt(msg, 10) > 0) {
    console.log()
    tunnel.start(remotePort)
  }
})

client.on('listening', function () {
  var address = client.address()
  console.log('client listening' + address.address + ':' + address.port)
})

client.bind(process.env.IAMALIVE_CPORT)
