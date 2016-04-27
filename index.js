#!/usr/bin/env node

require('./lib/init')
process.chdir(__dirname)

var path = require('path')
var http = require('http')
var fs = require('fs')

// NPM dependencies
var cmd = require('commander')
var mosca = require('mosca')
var spawn = require('child_process').spawn
var httpProxy = require('http-proxy')
var chalk = require('chalk')

// Project libraries
var app = require('./src')
var bootOnload = require('./src/boot-on-load')

const DASHBOARD_DNS = path.join(__dirname, './bin/dns.js')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.option('-sp, --secure_port <n>', 'Secure port to start the HTTPS server', parseInt)
.parse(process.argv)

// Launch server with web sockets
var server = http.createServer(app)
var broker = new mosca.Server({})
broker.attachHttpServer(server)

process.env.SPORT = cmd.secure_port || process.env.SECURE_PORT
process.env.PORT = cmd.port || process.env.PORT

var proxy = httpProxy.createServer({
  target: {
    host: 'localhost',
    port: process.env.PORT
  },
  ssl: {
    key: fs.readFileSync(__dirname + '/ssl/dashboard-key.pem', 'utf8'),
    cert: fs.readFileSync(__dirname + '/ssl/dashboard-cert.pem', 'utf8')
  },
  ws: true
}).listen(process.env.SECURE_PORT, function () {
  server.listen(process.env.PORT, function () {
    console.log('👾  Netbeast dashboard started on %s:%s', server.address().address, server.address().port)
    bootOnload()
  })
})

proxy.on('error', function (err, req, res) {
  if (err.code === 'ECONNRESET') {
    console.log(chalk.grey('ECONNRESET'))
    return res.end()
  } else {
    return console.trace(err)
  }
})

var env = Object.create(process.env)
env.NETBEAST_PORT = process.env.PORT
var options = { env: env }

//var dns = spawn(DASHBOARD_DNS, options)

require('./src/services/scanner')
require('./src/services/advertiser')

process.on('exit', function () {
  dns.kill('SIGTERM')
})
