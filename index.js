#!/usr/bin/env node

require('./lib/init')

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
const DASHBOARD_NETWORK = path.join(__dirname, './bin/discover-network.js')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

// Launch server with web sockets
var server = http.createServer(app)
var broker = new mosca.Server({})
broker.attachHttpServer(server)

process.env.PORT = cmd.port || process.env.PORT

server.listen(process.env.PORT, function () {
  console.log('👾  Netbeast dashboard started on %s:%s', server.address().address, server.address().port)
  bootOnload()
})

var dns = new (forever.Monitor)(DASHBOARD_DNS, {
  env: { 'NETBEAST_PORT': process.env.PORT },
  max: 1
})
dns.title = 'netbeast-dns'
dns.start()

var deamon = new (forever.Monitor)(DASHBOARD_DEAMON, {
  env: { 'NETBEAST_PORT': process.env.PORT },
  max: 1
})

deamon.title = 'netbeast-deamon'
deamon.start()

var network = new (forever.Monitor)(DASHBOARD_NETWORK, {
  env: { 'NETBEAST_PORT': process.env.PORT },
  max: 1
})

network.title = 'netbeast-network'
network.start()

process.on('exit', function () {
  deamon.kill('SIGTERM')
  dns.kill('SIGTERM')
})

process.on('uncaughtException', function (err) {
  console.error(err.stack)
})
