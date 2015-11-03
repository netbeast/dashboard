var path = require('path')
var events = require('events')
var spawn = require('child_process').spawn

var portfinder = require('portfinder')
var chalk = require('chalk')

var broker = require('./helpers/broker')
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
  done()
}

launcher.getApps = function (done) {
  App.all(function (err, apps) {
    if (err) return done(err)
    console.log(apps)

    apps = apps.filter(function (app) {
      console.log(app)

      return children[app.name]
    })

    done(null, apps)
  })
}

launcher.boot = function (appName, done) {
  var app = { name: appName }

  if (children[app.name]) {
    return done(null, children[app.name].port)
  }

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
}

module.exports = launcher
