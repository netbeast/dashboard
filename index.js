#!/usr/bin/env node

// Load environment variables
require('dotenv').load()

// Node native libraries
var path = require('path')
var http = require('http')

// NPM dependencies
var forever = require('forever-monitor')
var cmd = require('commander')
var mosca = require('mosca')

// Project libraries
var app = require('./src')
var bootOnload = require('./src/boot-on-load')

const DASHBOARD_DEAMON = path.join(__dirname, './bin/deamon.js')
const DASHBOARD_DNS = path.join(__dirname, './bin/dns.js')
const DASHBOARD_TUNNEL = path.join(__dirname, './bin/tunnel-c.js')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

// Launch server with web sockets
var server = http.createServer(app)
var broker = new mosca.Server({})
broker.attachHttpServer(server)

process.env.PORT = cmd.port || process.env.PORT
process.env.LOCAL_URL = 'http://localhost:' + process.env.PORT

server.listen(process.env.PORT, function () {
  console.log('👾  Netbeast dashboard started on %s:%s',
  server.address().address,
  server.address().port)
  bootOnload()
})

var dns = new (forever.Monitor)(DASHBOARD_DNS, {
  env: { 'NETBEAST_PORT': process.env.PORT },
  max: 1
})

dns.start()

var deamon = new (forever.Monitor)(DASHBOARD_DEAMON, {
  env: { 'NETBEAST_PORT': process.env.PORT },
  max: 1
})

deamon.title = 'netbeast'
deamon.start()

var tunnel = new (forever.Monitor)(DASHBOARD_TUNNEL, {
  options: ['localhost', '8000', '54.191.195.174', '8081'],
  env: { 'NETBEAST_PORT': process.env.PORT },
  max: 1
})

tunnel.start()

process.on('exit', function () {
  deamon.kill('SIGTERM')
  dns.kill('SIGTERM')
})
