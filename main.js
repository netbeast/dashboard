#!/usr/bin/env node

var fork = require('child_process').fork
var path = require('path')
//Electron
var mainWindow = null
var mainURL = null
const electron = require('electron')
const elecApp = electron.app
const BrowserWindow = electron.BrowserWindow

const indexJs = path.join(__dirname, './index.js')
var dashboard = fork(indexJs)

elecApp.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1000, height: 800, title: 'Netbeast Dashboard | Loading'})
  mainURL = path.join('file://' + __dirname + '/desktop_app/loading/loading.html')
  mainWindow.loadURL(mainURL)
  mainWindow.on('closed', function() {
      mainWindow = null;
  })
})

elecApp.on('activate', function () {
    if (mainWindow === null) {
      mainWindow = new BrowserWindow({width: 1000, height: 800, title: 'Netbeast Dashboard'})
      mainWindow.loadURL(mainURL)
    }
})

elecApp.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
     elecApp.quit()
    }
    mainWindow = null;
})

dashboard.on('message', function(data) {
   console.log(data)
   mainURL = 'http://localhost:8000'
   mainWindow.loadURL(mainURL)
})

process.on('exit', function () {
	dashboard.kill()
})
//dashboard.stdout.on('data', function (data) { console.log(data.toString()) })
//dashboard.stderr.on('data', function (data) { console.log(data.toString()) })