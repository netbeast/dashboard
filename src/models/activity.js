var path = require('path')
var events = require('events')
var spawn = require('child_process').spawn

var _ = require('lodash')
var request = require('request')
var portfinder = require('portfinder')
var chalk = require('chalk')
var async = require('async')

var broker = require('../helpers/broker')
var App = require('./app')

portfinder.basePort = 3000
const APPS_DIR = process.env.APPS_DIR

// Apps with their child object running
var children = {}
var self = module.exports = new events.EventEmitter()

self.start = function (req, res, next) {
  self.boot(req.params.name, function (err, child) {
    if (err) return next(err)
    self.ready(child, function (err, activity) {
      if (err) return next(err)

      res.json(_.pick(activity, ['name', 'port']))
    })
  })
}

self.status = function (req, res, next) {
  var child = children[req.params.name]
  if (!child) return next(new Error('App not running'))
  self.ready(child, function (err, activity) {
    if (err) return next(err)
    console.log(_.pick(activity, ['name', 'port']))
    res.json(_.pick(activity, ['name', 'port']))
  })
}

self.close = function (req, res, next) {
  self.stop(req.params.name, function (err) {
    if (err) return next(err)
    res.status(204).end()
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

self.ready = function (child, done) {
  if (child.ready) return done(null, child)

  const APP_URL = 'http://localhost:' + child.port
  const MAX_TRIALS = 20
  var k = 0

  function keepTrying () { return k < MAX_TRIALS }

  async.whilst(keepTrying, function (callback) {
    k++
    request(APP_URL, function (err, resp, body) {
      if (err && err.code !== 'ECONNREFUSED') {
        return done(err)
      } else if (resp && resp.statusCode < 400) {
        return done(null, child)
      } else {
        setTimeout(callback, 400)
      }
    })
  }, function (err) {
    if (err) return done(err)
    if (k === MAX_TRIALS) {
      return done(new Error('Impossible to launch the application'))
    }

    child.ready = true
    return done(null, child)
  })
}

self.boot = function (appName, done) {
  var child = { name: appName }

  if (children[appName]) {
    return done(null, children[child.name])
  }

  console.log('[booting] Looking for a free port for %s...', child.name)
  portfinder.getPort(function (err, port) {
    if (err) {
      done(new Error('Not enough ports'))
    } else {
      child.port = port
      console.log('[booting] Found port for %s at %s.', child.name, child.port)
      self.emit('start', child)
      done(null, child)
    }
  })
}

self.on('start', function (app) {
  if (children[app.name]) return

  App.getPackageJson(app.name, function (err, pkgJson) {
    if (err) return broker.error(err.toString())

    // child management
    var entryPoint = path.resolve(APPS_DIR, app.name, pkgJson.main)

    var child = spawn(entryPoint, ['--port', app.port], {
      cwd: path.join(APPS_DIR, app.name),
      env: process.env
    })

    child.stdout.on('data', function (data) {
      console.log(chalk.grey('[%s] %s'), app.name, data)
    })

    child.stderr.on('data', function (data) {
      console.log(chalk.red('[%s] %s'), app.name, data)
      // broker.error(data.toString(), app.name)
    })

    child.on('close', function (code) {
      children[app.name] = undefined
    })

    child.on('error', function (error) {
      broker.error(' exited with code ' + error || 0, app.name)
      console.trace(error)
      children[app.name] = undefined
    })

    app.process = child
    children[app.name] = app
  })
})

process.on('exit', function () {
  children.forEach(function (child) {
    child.process.kill('SIGTERM')
  })
})
