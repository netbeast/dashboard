#!/usr/bin/env node

//Electron
'use strict';

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
  
  const electron = require('electron')
  const app = electron.app
  const BrowserWindow = electron.BrowserWindow
  
  let mainWindow;

  function createWindow () {
    mainWindow = new BrowserWindow({width: 1000, height: 800, title: 'Netbeast Dashboard'})
    mainWindow.loadURL('http://localhost:8000')
    mainWindow.on('closed', function() {
      mainWindow = null;
    })
  }
  app.on('ready', createWindow)
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
     app.quit()
    }
  })
  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  })
  bootOnload()
})

var options = {
  env: { 'NETBEAST_PORT': process.env.PORT }
}

spawn(DASHBOARD_NETWORK, options)
spawn(DASHBOARD_DEAMON, options)
spawn(DASHBOARD_DNS, options)

process.on('exit', function () {
  deamon.kill('SIGTERM')
  dns.kill('SIGTERM')
})

process.on('uncaughtException', function (err) {
  console.error(err.stack)
})
