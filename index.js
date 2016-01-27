#!/usr/bin/env node

// Load environment variables
require('dotenv').config({path: __dirname + '/.env'})

// Node native libraries
var path = require('path')
var http = require('https')

// NPM dependencies
var forever = require('forever-monitor')
var cmd = require('commander')
var mosca = require('mosca')
var fs = require('fs')

// Project libraries
var app = require('./src')
var bootOnload = require('./src/boot-on-load')

const DASHBOARD_DEAMON = path.join(__dirname, './bin/deamon.js')
const DASHBOARD_DNS = path.join(__dirname, './bin/dns.js')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

var options = {
  key: fs.readFileSync('./certs/localhost.key'),
  cert: fs.readFileSync('./certs/localhost.crt')
}

// Launch server with web sockets
var server = http.createServer(options, app)
var broker = new mosca.Server({})
broker.attachHttpServer(server)

process.env.PORT = cmd.port || process.env.PORT
process.env.LOCAL_URL = 'https://localhost:' + process.env.PORT

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

process.on('exit', function () {
  deamon.kill('SIGTERM')
  dns.kill('SIGTERM')
})
