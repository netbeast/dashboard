#!/usr/bin/env node

// Dependencies
var app = require('./src')
var _bootOnLoad = require('./src/boot-on-load')
var forever = require('forever-monitor')
var config = require('./config')
var cmd = require('commander')
var http = require('http')
var path = require('path')

// Variables
var io, server

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

// Launch server with web sockets
server = http.createServer(app)
io = require('socket.io')(server)

// Listen on provided port, on all network interfaces.
server.listen(cmd.port || config.port, function () {
  console.log('Netbeast dashboard started on %s:%s',
  server.address().address,
  server.address().port)
  _bootOnLoad()
})

// Start the deamon that recognises other netbeasts
var deamonBin = path.join(__dirname, 'bin/deamon.js')
var deamon = new (forever.Monitor)(deamonBin, {max: 1})
deamon.start()

exports.io = io
exports.server = server
