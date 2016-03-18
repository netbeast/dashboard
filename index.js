#!/usr/bin/env node

require('./lib/init')

// Node native libraries
var path = require('path')
var http = require('http')

// NPM dependencies
var cmd = require('commander')
var mosca = require('mosca')
var spawn = require('child_process').spawn

process.chdir(__dirname)
// Project libraries
var app = require('./src')
var bootOnload = require('./src/boot-on-load')

const DASHBOARD_NETWORK = path.join(__dirname, './bin/network.js')
const DASHBOARD_DEAMON = path.join(__dirname, './bin/deamon.js')
const DASHBOARD_DNS = path.join(__dirname, './bin/dns.js')

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

var env = Object.create(process.env)
env.NETBEAST_PORT = process.env.PORT
var options = { env: env }

var network = spawn(DASHBOARD_NETWORK, options)
var deamon = spawn(DASHBOARD_DEAMON, options)
var dns = spawn(DASHBOARD_DNS, options)

network.stdout.on('data', (data) => {
  console.log(data.toString())
})
deamon.stdout.on('data', (data) => {
  console.log(data.toString())
})
dns.stdout.on('data', (data) => {
  console.log(data.toString())
})

process.on('exit', function () {
  network.kill('SIGTERM')
  deamon.kill('SIGTERM')
  dns.kill('SIGTERM')
})

process.on('uncaughtException', function (err) {
  console.error(err.stack)
})
