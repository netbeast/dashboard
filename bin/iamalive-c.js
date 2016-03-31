#!/usr/bin/env node

var dgram = require('dgram')
var client = dgram.createSocket('udp4')
var path = require('path')
var spawn = require('child_process').spawn
var env_tunnel = Object.create(process.env)

env_tunnel
.NETBEAST_PORT = process.env.PORT
.SERVER_IP = process.env.SERVER_IP
const DASHBOARD_TUNNEL = path.join(__dirname, './tunnel-c.js')

console.log('Server ' + process.env.SERVER_IP + ':' + process.env.IAMALIVE_SPORT)

setInterval(function () {
  require('getmac').getMac(function (err, macAddress) {
    if (err) throw err
    var msg = new Buffer(macAddress)
    client.send(msg, 0, msg.length, process.env.IAMALIVE_SPORT, process.env.SERVER_IP, function (err) {
      if (err) {
        throw err
      }
      console.log('Sendend:' + process.env.IAMALIVE_SPORT + ' to ' + process.env.SERVER_IP)
      // client.close()
    })
  })
}, 1000)

client.on('message', function (msg, rinfo) {
  var remotePort = msg.toString()
  console.log('client got: ' + remotePort + ' from ' + rinfo.address + ':' + rinfo.port)
  if (parseInt(msg, 10) > 0) {
    console.log()
    // tunnel.start(remotePort)
    env_tunnel.RELAY_PORT = remotePort
    var tunnelOptions = { env: env_tunnel }
    var tunnel = spawn(DASHBOARD_TUNNEL, tunnelOptions)

    tunnel.stdout.on('data', function (data) {
      console.log(data.toString())
    })

    tunnel.stderr.on('data', function (data) {
      console.log(data.toString())
    })

    tunnel.on('close', function (code) {
      console.log('child process tunnel exited with code ' + code.toString())
    })

    process.on('exit', function () {
      tunnel.kill('SIGTERM')
    })
  }
})

client.on('listening', function () {
  var address = client.address()
  console.log('client listening ' + address.address + ':' + address.port)
})

client.bind(process.env.IAMALIVE_CPORT)
