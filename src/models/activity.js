var path = require('path')
var events = require('events')
var spawn = require('child_process').spawn

var portfinder = require('portfinder')
var chalk = require('chalk')
var request = require('superagent')
var mqtt = require('mqtt')

var broker = require('../helpers/broker')
var ApiError = require('../util/api-error')
var Resource = require('./resource')
var App = require('./app')

portfinder.basePort = 3000
const APPS_DIR = process.env.APPS_DIR

// Apps with their child object running
var children = {}
var self = module.exports = new events.EventEmitter()
var client = mqtt.connect() // for notifications

self.status = function (req, res, next) {
  var child = children[req.params.name]
  if (!child) return next(new ApiError(404, 'App not running'))
  self.ready(child, function (err, act) {
    if (err) return next(err)
    res.json({ name: act.name, port: act.port })
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
  App.modules(function (err, apps) {
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

  ;(function keepTrying () {
    if (k >= MAX_TRIALS) return done(new ApiError(405, 'Impossible to launch the application'))

    request(APP_URL).end(function (err, resp) {
      if (err && err.code === 'ECONNREFUSED') {
        k++
        return setTimeout(keepTrying, 400)
      } else if (!err || err.status === 404) {
        child.ready = true
        return done(null, child)
      } else {
        console.log(err)
        return done(err)
      }
    })
  })()
}

self.boot = function (appName, done) {
  var child = { name: appName }

  if (children[appName]) {
    return done(null, children[child.name])
  }

  portfinder.getPort(function (err, port) {
    if (err) {
      done(new ApiError(405, 'Not enough ports'))
    } else {
      child.port = port
      self.emit('start', child)
      done(null, child)
    }
  })
}

self.on('start', function (app) {
  if (children[app.name]) return

  App.getPackageJson(app.name, function (err, pkgJson) {
    if (err) return broker.error(err.toString())

    // *****************
    // Child management
    // *****************

    var entryPoint = path.resolve(APPS_DIR, app.name, pkgJson.main)

    var env = Object.create(process.env)
    env.APP_PORT = app.port
    env.APP_NAME = app.name
    env.NETBEAST = process.env.IPs.split(',')[0] + ':' + process.env.PORT

    var child = spawn(entryPoint, ['--port', app.port], {
      cwd: path.join(APPS_DIR, app.name),
      env: env
    })

    child.stdout.on('data', function (data) {
      console.log(chalk.grey('[%s] %s'), app.name, data)
    })

    child.stderr.on('data', function (data) {
      console.log(chalk.red('[%s] %s'), app.name, data)
      // broker.error(data.toString(), app.name)
    })

    child.on('close', function (code) {
      client.publish('netbeast/activities/close', app.name)
      Resource.findOne({ app: app.name }, function (err, resource) {
        if (err) return console.error(err)

        resource.destroy()
      })
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
  for (var key in children) {
    children[key].process.kill('SIGTERM')
  }
})
