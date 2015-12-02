#!/usr/bin/env node

// Node native libraries
var path = require('path')
var http = require('http')

// NPM dependencies
var forever = require('forever-monitor')
var io = require('socket.io')()
var cmd = require('commander')

// Project libraries
var app = require('./src')
var config = require('./config')
var bootOnload = require('./src/boot-on-load')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

// Launch server with web sockets
var server = module.exports = http.createServer(app)

config.port = cmd.port || config.port
server.listen(config.port, function () {
  console.log('Netbeast dashboard started on %s:%s',
  server.address().address,
  server.address().port)
  bootOnload()
})

io.listen(server)
io.on('connection', require('./src/broker'))
