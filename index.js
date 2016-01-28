#!/usr/bin/env node

// Load environment variables
require('dotenv').config({path: __dirname + '/.env'})

// Node native libraries
var path = require('path')
var http = require('https')
var express = require('express')
var redir = express()

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
process.env.REDIR_PORT = (parseInt(process.env.PORT) + 1).toString()

// Launch a http common server that redirects to https
redir
/*
.createServer() */
.get('*', function (req, res) {
  res.redirect(process.env.LOCAL_URL)
})
.listen(process.env.REDIR_PORT, function () {
  console.log('Redirection server listening on ' + process.env.REDIR_PORT)
})

server.listen(process.env.PORT, function () {
  console.log('👾  Netbeast dashboard started on ', process.env.LOCAL_URL)
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
