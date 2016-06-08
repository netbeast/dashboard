#!/usr/bin/env node

require('./lib/init')
process.chdir(__dirname)

var http = require('http')
var fs = require('fs')
// const spawn = require('child_process').spawn
// var path = require('path')

// NPM dependencies
var cmd = require('commander')
var websocket = require('websocket-stream')
var aedes = require('aedes')({
  concurrency: 1000
})

var httpProxy = require('http-proxy')
var chalk = require('chalk')

// Project libraries
var app = require('./src')
var bootOnload = require('./src/boot-on-load')

// const DASHBOARD_IAMALIVE = path.join(__dirname, './bin/iamalive-c.js')
// const DASHBOARD_DNS = path.join(__dirname, './bin/dns.js')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.option('-sp, --secure_port <n>', 'Secure port to start the HTTPS server', parseInt)
.parse(process.argv)

var server = http.createServer(app)

process.env.SECURE_PORT = cmd.secure_port || process.env.SECURE_PORT
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
    const addr = server.address().address
    const port = server.address().port
    console.log('👾  Netbeast dashboard started on %s:%s', addr, port)
    // attach mqtt broker to websockets stream
    websocket.createServer({ server: server }, aedes.handle)
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

// var env = Object.create(process.env)
// var env_iamalive = Object.create(process.env)
//
// env_iamalive
//   .NETBEAST_PORT = process.env.PORT
//   .IAMALIVE_SPORT = process.env.IAMALIVE_SPORT
//   .IAMALIVE_CPORT = process.env.IAMALIVE_CPORT
//   .SERVER_IP = process.env.SERVER_IP
//
// env.NETBEAST_PORT = process.env.PORT
//
// var iamaliveOptions = { env: env_iamalive }
//
// var iamalive = spawn(DASHBOARD_IAMALIVE, iamaliveOptions)

require('./src/services/scanner')
require('./src/services/advertiser')

// process.on('exit', function () {
//   dns.kill('SIGTERM')
// })
