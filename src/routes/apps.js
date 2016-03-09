var path = require('path')
var express = require('express')
var fs = require('fs-extra')

var App = require('../models/app')
var Activity = require('../models/activity')
var installer = require('../middleware/installer')

var NotFound = require('../util/not-found')
var InvalidFormat = require('../util/invalid-format')

var router = module.exports = express.Router()

router.route('/apps')
.post(installer.upload, installer.process)
.get(function (req, res, next) {
  App.all(function (err, files) {
    if (err) return next(err)

    res.json(files)
  })
})

router.route('/apps/:name')
.get(function (req, res, next) {
  App.getPackageJson(req.params.name, function (err, packageJson) {
    if (err) return next(err)

    res.json(packageJson)
  })
})
.put(function (req, res, next) {
  const file = path.join(process.env.APPS_DIR, req.params.name, 'package.json')
  fs.writeJson(file, req.body, function (err) {
    if (err) {
      next(new InvalidFormat('Not a valid package.json'))
    } else {
      res.status(204).end()
    }
  })
})
.delete(function (req, res, next) {
  Activity.stop(req.params.name, function (err) {
    if (err) {
      return next(new Error('Activity could not stop ' + req.params.name))
    } else {
      App.delete(req.params.name, function (err) {
        if (err && err.code === 404) {
          return next(new NotFound())
        } else if (err) {
          return next(err)
        } else {
          res.status(204).end()
        }
      })
    }
  })
})

router.get('/apps/:name/logo', function (req, res) {
  const pkgJson = path.join(process.env.APPS_DIR, req.params.name, 'package.json')
  var app = {}
  var isPlugin = false

  try {
    app = fs.readJsonSync(pkgJson) // kamikaze line
    isPlugin = app.netbeast && app.netbeast.type === 'plugin'
    const appLogo = path.resolve(process.env.APPS_DIR, app.name, app.logo)
    res.sendFile(appLogo)
  } catch (e) {
    console.error(e)
    if (isPlugin) res.sendFile(path.resolve(process.env.PUBLIC_DIR, 'img/plugin.png'))
    else res.sendFile(path.resolve(process.env.PUBLIC_DIR, 'img/dflt.png'))
  }
})

router.get('/apps/:name/port?', function (req, res) {
  const app = Activity.get(req.params.name)
  if (app) {
    res.json(app.port)
  } else {
    res.status(403).send('App not running')
  }
})

router.get('/apps/:name/readme', function (req, res, next) {
  const readme = path.join(process.env.APPS_DIR, req.params.name, 'README.md')
  if (!fs.existsSync(readme)) {
    return res.status(404).send('This app does not have a README.md')
  }

  res.sendFile(readme)
})

router.get('/apps/:name/package', function (req, res, next) {
  App.getPackageJson(req.params.name, function (err, data) {
    if (err) return next(err)

    res.header('Content-Type', 'text/plain')
    res.send('' + data)
  })
})
