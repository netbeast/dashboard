#!/usr/bin/env node

var host = '127.0.0.1'

var port = process.env.PORT
var relayPort = process.env.RELAY_PORT
var relayHost = process.env.SERVER_IP
console.log(port + ' ' + relayPort + ' ' + relayHost);

var net = require('net')

// module.exports.start = function (relayPort) {
  function connect () {
    // var relaySocket = new net.Socket().setKeepAlive(true, 10000)
    var relaySocket = new net.Socket()
    var serverSocket

    relaySocket.connect(relayPort, relayHost, function () {
      console.log('relay socket established')
      relaySocket.on('data', function (data) {
        if (serverSocket === undefined) {
          // serverSocket = new net.Socket().setKeepAlive(true, 10000)
          serverSocket = new net.Socket()

          serverSocket.connect(port, host, function () {
            console.log('server socket established')
            serverSocket.write(data)
          })
          serverSocket.on('data', function (data) {
            try {
              relaySocket.write(data)
            } catch (ex) {
              console.log(ex)
            }
          })
          serverSocket.on('close', function (had_error) {
            console.log('server socket closed')
            relaySocket.end()
          })
          serverSocket.on('error', function (exception) {
            console.log('server socket error')
            console.log(exception)
            relaySocket.end()
          })

          connect()
          console.log('next relay socket established')
        } else {
          try {
            serverSocket.write(data)
          } catch (ex) {
            console.log(ex)
          }
        }
      })
      relaySocket.on('close', function (had_error) {
        console.log('relay socket closed')
        if (serverSocket !== undefined) {
          serverSocket.end()
        }
      })
      relaySocket.on('error', function (exception) {
        console.log('relay socket error')
        console.log(exception)
      })
    })
  }

  var count = 1

  for (var i = 0; i < count; i++) {
    connect()
  }
//}
