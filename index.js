#!/usr/bin/env node

// Load environment variables
require('dotenv').load()

// Node native libraries
var path = require('path')
var http = require('http')

// NPM dependencies
var forever = require('forever-monitor')
var io = require('socket.io')()
var cmd = require('commander')

// Project libraries
var app = require('./src')
var bootOnload = require('./src/boot-on-load')

const DASHBOARD_DEAMON = path.join(__dirname, './bin/deamon.js')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

// Launch server with web sockets
var server = http.createServer(app)

process.env.PORT = cmd.port || process.env.PORT
process.env.LOCAL_URL = 'http://localhost:' + process.env.PORT

server.listen(process.env.PORT, function () {
  console.log('👾  Netbeast dashboard started on %s:%s',
  server.address().address,
  server.address().port)
  bootOnload()
})

var deamon = new (forever.Monitor)(DASHBOARD_DEAMON, {
  env: { 'NETBEAST_PORT': process.env.PORT },
  max: 1
})

deamon.title = 'netbeast'
deamon.start()

process.on('exit', function () {
  deamon.kill('SIGTERM')
})

io.listen(server)
io.on('connection', require('./src/broker'))
io.use(function (socket, next) {
  next() // socket middleware
})
