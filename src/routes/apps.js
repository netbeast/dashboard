var express = require('express')
, showdown  = require('showdown')
, config = require('../../config')
, Helper = require('../helpers')
, fs = require('fs-extra')
, path = require('path')
, installer = require('../installer')
, launcher = require('../launcher')
, httpProxy = require('http-proxy')
, npm = require('npm')
, broker = require('../helpers/broker')
, E = require('../error')

var router = express.Router()

// GET
router.get('/apps', function(req, res) {
  fs.readdir(config.appsDir, function(err, files) {
    if (err)
      throw err

    res.json(files)
  })
})

router.get('/apps/:name', function(req, res, next) {
  var pkgJson = path.join(config.appsDir, req.params.name, 'package.json')
  var app = fs.readJsonSync(pkgJson, { throw: false })
  if (app !== undefined) {
    res.json(app)
  } else {
    next(new E.NotFound())
  }
})

router.get('/apps/:name/logo', function (req, res) {
  var pkgJson = path.join(config.appsDir, req.params.name, 'package.json')
  var app = fs.readJsonSync(pkgJson, { throw: false })
  try {
    var appRoot = path.join(config.appsDir, app.name)
    var appLogo = path.join(appRoot, app.logo)
    res.sendFile(appLogo)
  } catch (e) {
    res.sendFile(path.join(config.publicDir, 'img/dflt.png'))
  }
})

router.get('/apps/:name/port?', function(req, res) {
  var app = launcher.getApp(req.params.name)
  if (app) {
    console.dir(app.port)
    res.json(app.port)
  } else {
    res.status(403).send("App not running")
  }
})

router.get('/apps/:name/readme', function (req, res) {
  var readme = path.join(config.appsDir, req.params.name, 'README.md')
  if (!fs.existsSync(readme))
    return res.send("This app does not have a README.md")

  fs.readFile(readme, 'utf8', function (err, data) {
    var converter = new showdown.converter(),
    html = converter.makeHtml(data)
    res.send(html)
  })
})

router.get('/apps/:name/package', function (req, res) {
  var pkg = path.join(config.appsDir, req.params.name, 'package.json')
  if (!fs.existsSync(pkg))
    return res.send("Fatal: This app does not have a package.json")

  fs.readFile(pkg, 'utf8', function (err, data) {
    res.header("Content-Type", "text/plain")
    res.send('' + data)
  })
})

// CREATE
router.post('/apps', installer, function (req, res) {
  // do nothing but let installer handle
  if (req.body.url) {
    console.log("installing from %s", req.body.url)
    npm.load({}, function () {
      npm.commands.install(config.sandbox, req.body.url, function(err) {

        if (err && err.code === 'ENOENT') {
          broker.emit('stderr', 'Sorry, this is not a valid xway app')
        } else if (err) {
          broker.emit('stderr', err.toString())
          throw err
        }

        broker.emit('stdout', 'Installation ended')
        res.status(204).send()
      })
    })
  }
})

// DELETE
router.delete('/apps/:name', function (req, res, next) {
  launcher.stop(req.params.name, function (err) {
    if (err) {
      next(new Error('Launcher stopped'))
    } else {
      Helper.deleteApp(req.params.name, function (err) {
        if (err && err.code === 404)
          next(new E.NotFound('App not found'))
        else if(err)
          next(new Error('Launcher stopped'))
        else
          res.status(204).json('The app was deleted')
      })
    }
  })
})


router.put('/apps/:name', function (req, res, next) {
  var file = path.join(config.appsDir, req.params.name, 'package.json')
  fs.writeJson(file, req.body, function(err) {
    if (err)
      next(new E.InvalidFormat('Not a valid package.json'))
    else
      res.json(204)
  })
})

// Proxy
//======
var proxy = httpProxy.createProxyServer({ws: true})
router.use('/i/:name?', function(req, res)  {
  var app, reqPath, referer, proxyUrl
  // Capture the referer to proxy the request
  // in case the path is not clear enaugh
  if (req.get('referer') !== undefined) {
    var aux = req.get('referer').split('/')
    referer = aux[aux.indexOf('i') + 1]
  }
  // This block returns an app object
  // with the port where it is running
  app = launcher.getApp(req.params.name)
  || launcher.getApp(referer)
  
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
    res.status(404).json("App not running")
  }
})

module.exports = router