#!/usr/bin/env node

require('./lib/init')
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

const DASHBOARD_DEAMON = path.join(__dirname, './bin/deamon.js')
const DASHBOARD_DNS = path.join(__dirname, './bin/dns.js')
const DASHBOARD_NETWORK = path.join(__dirname, './bin/network.js')
const DASHBOARD_TUNNEL = path.join(__dirname, './bin/tunnel-c.js')
const DASHBOARD_IAMALIVE = path.join(__dirname, './bin/iamalive-c.js')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.option('-sp, --securePort <n>', 'Secure Port to start the HTTPS server', parseInt)
.parse(process.argv)

// Launch server with web sockets
var server = http.createServer(app)
var broker = new mosca.Server({})
broker.attachHttpServer(server)

process.env.SPORT = cmd.securePort || process.env.SECURE_PORT
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

var network = spawn(DASHBOARD_NETWORK, options)
var deamon = spawn(DASHBOARD_DEAMON, options)
var dns = spawn(DASHBOARD_DNS, options)

// ---------------------------------------- SPAWN CONFIG FOR IAMALIVE NEEDED
/*
var tunnel = new (forever.Monitor)(DASHBOARD_TUNNEL, {
  env: { 'NETBEAST_PORT': process.env.PORT,
  'RELAY_PORT': process.env.RELAY_PORT,
  'SERVER_IP': process.env.SERVER_IP },
  max: 1
})

tunnel.title = 'netbeast-tunnel'
tunnel.start()

var iamalive = new (forever.Monitor)(DASHBOARD_IAMALIVE, {
  env: { 'NETBEAST_PORT': process.env.PORT,
  'IAMALIVE_SPORT': process.env.IAMALIVE_SPORT,
  'IAMALIVE_CPORT': process.env.IAMALIVE_CPORT,
  'SERVER_IP': process.env.SERVER_IP },
  max: 1
})

iamalive.title = 'netbeast-tunnel'
iamalive.start()
*/

process.on('exit', function () {
  network.kill('SIGTERM')
  deamon.kill('SIGTERM')
  dns.kill('SIGTERM')
})
