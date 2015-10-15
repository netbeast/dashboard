var spawn = require('child_process').spawn
var broker = require('./helpers/broker')
var portfinder = require('portfinder')
var fs = require('fs-extra')
var events = require('events')
var chalk = require('chalk')
var path = require('path')

portfinder.basePort = 3000
// Apps with their child object running
var children = {}

var launcher = new events.EventEmitter()

launcher.on('start', function (app) {
  var appRoot, pkgJson, entryPoint

  if (children[app.name]) return

  appRoot = path.join(__dirname, '../.sandbox/node_modules', app.name)
  pkgJson = fs.readJsonSync(path.join(appRoot, 'package.json'))

  if (!pkgJson || !pkgJson.main) return

  // child management
  entryPoint = path.join(appRoot, pkgJson.main)
  var child = spawn(entryPoint, ['--port', app.port], {
    cwd: appRoot
  })

  child.stdout.on('data', function (data) {
    console.log(chalk.grey('[%s] %s'), app.name, data)
  })

  child.stderr.on('data', function (data) {
    broker.notify({ emphasis: 'error', title: app.name, body: data })
  })

  child.on('close', function (code) {
    broker.notify({ title: app.name, body: code })
    children[app.name] = undefined
  })

  child.on('error', function (code) {
    broker.notify({ emphasis: 'error', title: app.name, body: code })
    children[app.name] = undefined
  })

  app.process = child
  children[app.name] = app
})

launcher.start = function (req, res) {
  launcher.boot(req.params.name, function (err, port) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({port: port})
    }
  })
}

launcher.close = function (req, res) {
  launcher.stop(req.params.name, function (err) {
    if (err) {
      console.trace('' + err)
      res.status(500).json('' + err)
    } else {
      res.send('App closed')
    }
  })
}

launcher.stop = function (appName, callback) {
  if (children[appName]) {
    console.log('Sending SIGTERM to ' + appName)
    children[appName].process.kill('SIGTERM')
    children[appName] = undefined
  }
  callback.call(this)
}

launcher.getApps = function () {
  var data = []
  var dir = path.join(__dirname, '../.sandbox/node_modules')
  fs.readdirSync(dir).forEach(function (app) {
    if (children[app]) {
      data.push(app)
    }
  })
  return data
}

launcher.boot = function (appName, callback) {
  var app = { name: appName }

  if (!children[app.name]) {
    console.log('[booting] Looking for a free port for %s...', app.name)
    portfinder.getPort(function (err, port) {
      if (err) {
        callback.call(this, new Error('Not enough ports'))
      } else {
        app.port = port
        console.log('[booting] Found port for %s at %s.', app.name, app.port)
        launcher.emit('start', app)
        callback.call(this, null, port)
      }
    })
  } else if (children[app.name]) {
    callback.call(this, null, children[app.name].port)
  } else {
    callback.call(this, new Error('Server error at launcher.start'))
  }
}

launcher.getApp = function (appName) {
  return children[appName]
}

module.exports = launcher
