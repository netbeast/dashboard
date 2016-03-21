#!/usr/bin/env node

require('./lib/init')
var path = require('path')
 var http = require('http')
var https = require('https')

 // NPM dependencies
 var cmd = require('commander')
 var mosca = require('mosca')
 var fs = require('fs')
 var spawn = require('child_process').spawn


 // Project libraries
 var app = require('./src')
 var bootOnload = require('./src/boot-on-load')

 const DASHBOARD_NETWORK = path.join(__dirname, './bin/network.js')
 const DASHBOARD_DEAMON = path.join(__dirname, './bin/deamon.js')
 const DASHBOARD_DNS = path.join(__dirname, './bin/dns.js')

const certs = {
  key: fs.readFileSync(__dirname + '/ssl/dashboard-key.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/dashboard-cert.pem')
}

 cmd
 .version('0.1.42')
 .option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
 .option('-sp, --securePort <n>', 'Secure Port to start the HTTPS server', parseInt)
 .parse(process.argv)

 // Launch server with web sockets
var server = http.createServer(app)
var broker = new mosca.Server({})
//broker.attachHttpServer(server)

var settings = {
  secure: {
    keyPath: __dirname + '/ssl/dashboard-key.pem',
    certPath: __dirname + '/ssl/dashboard-cert.pem'
  }
}
var secureBroker = new mosca.Server(settings, function () {
  console.log('inside secure')
})
var secureServer = https.createServer(certs, app)
//secureBroker.attachServer(secureServer)
// ----------------------------------------------------------------------------------------------------------

process.env.SPORT = cmd.securePort || process.env.SECURE_PORT
process.env.PORT = cmd.port || process.env.PORT

server.listen(process.env.PORT, function () {
  console.log('👾  Netbeast dashboard started on %s:%s', server.address().address, server.address().port)
   bootOnload()
 })

secureServer.listen(process.env.SECURE_PORT, function () {
  console.log('👾  Netbeast secure dashboard started on %s:%s', secureServer.address().address, secureServer.address().port)
  bootOnload()
})

var env = Object.create(process.env)
env.NETBEAST_PORT = process.env.PORT
var options = { env: env }

var network = spawn(DASHBOARD_NETWORK, options)
var deamon = spawn(DASHBOARD_DEAMON, options)
var dns = spawn(DASHBOARD_DNS, options)

process.on('exit', function () {
  network.kill('SIGTERM')
  deamon.kill('SIGTERM')
  dns.kill('SIGTERM')

})
