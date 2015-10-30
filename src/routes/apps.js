var express = require('express')
var Showdown = require('showdown')
var config = require('../../config')
var fs = require('fs-extra')
var path = require('path')
var installer = require('../installer')
var launcher = require('../launcher')
var httpProxy = require('http-proxy')
var App = require('../models/app')
var NotFound = require('../util/not-found')
var InvalidFormat = require('../util/invalid-format')
var router = express.Router()

// GET
router.get('/apps', function (req, res, next) {
  App.all(function (err, files) {
    if (err) return next(err)

    res.json(files)
  })
})

router.get('/apps/:name', function (req, res, next) {
  App.getPackageJson(req.params.name, function (err, packageJson) {
    if (err) return next(err)

    res.json(packageJson)
  })
})

router.get('/apps/:name/logo', function (req, res) {
  var pkgJson = path.join(config.appsDir, req.params.name, 'package.json')
  try {
    var app = fs.readJsonSync(pkgJson)
    var appRoot = path.join(config.appsDir, app.name)
    var appLogo = path.join(appRoot, app.logo)
    res.sendFile(appLogo)
  } catch (e) {
    res.sendFile(path.join(config.publicDir, 'img/dflt.png'))
  }
})

router.get('/apps/:name/port?', function (req, res) {
  var app = launcher.getApp(req.params.name)
  if (app) {
    console.dir(app.port)
    res.json(app.port)
  } else {
    res.status(403).send('App not running')
  }
})

router.get('/apps/:name/readme', function (req, res, next) {
  var readme = path.join(config.appsDir, req.params.name, 'README.md')
  if (!fs.existsSync(readme)) {
    return res.send('This app does not have a README.md')
  }

  fs.readFile(readme, 'utf8', function (err, data) {
    if (err) return next(err)
    var converter = new Showdown.converter()
    var html = converter.makeHtml(data)
    res.send(html)
  })
})

router.get('/apps/:name/package', function (req, res, next) {
  App.getPackageJson(req.params.name, function (err, data) {
    if (err) return next(err)

    res.header('Content-Type', 'text/plain')
    res.send('' + data)
  })
})

// CREATE
router.post('/apps', installer.multer, installer.process, installer.git)

router.delete('/apps/:name', function (req, res, next) {
  launcher.stop(req.params.name, function (err) {
    if (err) {
      return next(new Error('Launcher could not stop the app'))
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

router.put('/apps/:name', function (req, res, next) {
  var file = path.join(config.appsDir, req.params.name, 'package.json')
  fs.writeJson(file, req.body, function (err) {
    if (err) {
      next(new InvalidFormat('Not a valid package.json'))
    } else {
      res.status(204).end()
    }
  })
})

// Proxy
// ======
var proxy = httpProxy.createProxyServer({ws: true})
router.use('/i/:name?', function (req, res) {
  var app, reqPath, referer, proxyUrl
  // Capture the referer to proxy the request
  // in case the path is not clear enaugh
  if (req.get('referer') !== undefined) {
    var aux = req.get('referer').split('/')
    referer = aux[aux.indexOf('i') + 1]
  }
  // This block returns an app object
  // with the port where it is running
  app = launcher.getApp(req.params.name) || launcher.getApp(referer)

  if (app) {
    // Here app is running
    // In case the path is /i/:name
    // instead of /i/:name/ you need this block
    req.url = (req.url === '/') ? '' : req.url
    reqPath = (referer !== undefined)
    ? '/' + req.params.name + req.url
    : req.url

    req.url = reqPath.replace('/i/', '/')
    req.url = req.url.replace('/' + app.name, '')

    // This block of code actually pipes the request
    // to the running app and pass it to the client
    proxyUrl = req.protocol + '://localhost:' + app.port
    proxy.web(req, res, { target: proxyUrl })
  } else {
    // Here app is not running
    res.status(404).json('App not running')
  }
})

module.exports = router
