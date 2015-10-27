var spawn = require('child_process').spawn
var broker = require('./helpers/broker')
var portfinder = require('portfinder')
var fs = require('fs-extra')
var events = require('events')
var chalk = require('chalk')
var path = require('path')
var App = require('./models/app')
var config = require('../config')

portfinder.basePort = 3000
// Apps with their child object running
var children = {}

var launcher = new events.EventEmitter()

launcher.on('start', function (app) {
  if (children[app.name]) return

  App.getPackageJson(app.name, function (err, pkgJson) {
    if (err) return broker.error({ body: err.toString })
    if (!pkgJson || !pkgJson.main) {
      return broker.error({ body: 'App does not have proper package.json' })
    }

    // child management
    var entryPoint = path.join(config.appsDir, app.name, pkgJson.main)
    var child = spawn(entryPoint, ['--port', app.port], {
      cwd: path.join(config.appsDir, app.name)
    })

    child.stdout.on('data', function (data) {
      console.log(chalk.grey('[%s] %s'), app.name, data)
    })

    child.stderr.on('data', function (data) {
      broker.error({ title: app.name, body: data })
    })

    child.on('close', function (code) {
      broker.info({ title: app.name, body: code })
      children[app.name] = undefined
    })

    child.on('error', function (code) {
      broker.error({ title: app.name, body: code })
      children[app.name] = undefined
    })

    app.process = child
    children[app.name] = app
  })
})

launcher.start = function (req, res, next) {
  launcher.boot(req.params.name, function (err, port) {
    if (err) return next(err)
    res.json({port: port})
  })
}

launcher.close = function (req, res, next) {
  launcher.stop(req.params.name, function (err) {
    if (err) return next(err)
    res.send('App closed')
  })
}

launcher.stop = function (appName, done) {
  if (children[appName]) {
    console.log('Sending SIGTERM to ' + appName)
    children[appName].process.kill('SIGTERM')
    children[appName] = undefined
  }
  done(this)
}

launcher.getApps = function () {
  var data = []
  fs.readdirSync(config.appsDir).forEach(function (app) {
    if (children[app]) data.push(app)
  })
  return data
}

launcher.boot = function (appName, done) {
  var app = { name: appName }

  if (!children[app.name]) {
    console.log('[booting] Looking for a free port for %s...', app.name)
    portfinder.getPort(function (err, port) {
      if (err) {
        done(new Error('Not enough ports'))
      } else {
        app.port = port
        console.log('[booting] Found port for %s at %s.', app.name, app.port)
        launcher.emit('start', app)
        done(null, port)
      }
    })
  } else if (children[app.name]) {
    done(null, children[app.name].port)
  } else {
    done(new Error('Server crashed when booting app'))
  }
}

launcher.getApp = function (appName) {
  return children[appName]
}

module.exports = launcher
