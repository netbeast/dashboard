var path = require('path')
var events = require('events')
var spawn = require('child_process').spawn

var request = require('request')
var portfinder = require('portfinder')
var chalk = require('chalk')
var async = require('async')

var broker = require('../helpers/broker')
var config = require('../../config')
var App = require('./app')

portfinder.basePort = 3000

// Apps with their child object running
var children = {}

var self = new events.EventEmitter()

self.start = function (req, res, next) {
  self.boot(req.params.name, function (err, port) {
    if (err) return next(err)
    self.ready(port, function (err) {
      if (err) return next(err)

      broker.success('app initiated at port ' + port)
      res.json({ port: port })
    })
  })
}

self.close = function (req, res, next) {
  self.stop(req.params.name, function (err) {
    if (err) return next(err)
    res.send('App closed')
  })
}

self.stop = function (appName, done) {
  if (children[appName]) {
    console.log('Sending SIGTERM to ' + appName)
    children[appName].process.kill('SIGTERM')
    children[appName] = undefined
  }
  done()
}

self.get = function (appName) {
  return children[appName]
}

self.all = function (done) {
  App.all(function (err, apps) {
    if (err) return done(err)

    apps = apps.filter(function (app) {
      return children[app.name]
    })

    done(null, apps)
  })
}

self.ready = function (appPort, done) {
  const APP_URL = 'http://localhost:' + appPort
  const MAX_TRIALS = 9
  var k = 0
  function keepTrying () { return k < MAX_TRIALS }

  async.whilst(keepTrying, function (callback) {
    k++
    console.log('checking ' + APP_URL)
    request(APP_URL, function (err, resp, body) {
      if (err && err.code !== 'ECONNREFUSED') {
        return done(err)
      } else if (resp && resp.statusCode < 400) {
        return done()
      } else {
        setTimeout(callback, 200)
      }
    })
  }, function (err) {
    if (err) return done(err)
    if (k === MAX_TRIALS) {
      return done(new Error('Impossible to launch the application'))
    }

    return done()
  })
}

self.boot = function (appName, done) {
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
      self.emit('start', app)
      done(null, port)
    }
  })
}

self.on('start', function (app) {
  if (children[app.name]) return

  App.getPackageJson(app.name, function (err, pkgJson) {
    if (err) return broker.error({ body: err.toString })

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
      broker.info({
        title: app.name, body: ' exited with code ' + code || 0
      })
      children[app.name] = undefined
    })

    child.on('error', function (code) {
      broker.error({
        title: app.name, body: ' exited with code ' + code || 0
      })
      children[app.name] = undefined
    })

    app.process = child
    children[app.name] = app
  })
})

module.exports = self
