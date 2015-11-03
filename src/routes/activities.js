var launcher = require('../launcher')
var httpProxy = require('http-proxy')
var express = require('express')
var router = express.Router()

// Activities
// ==========
router.get('/activities', function (req, res, next) {
  launcher.getApps(function (err, apps) {
    if (err) return next(err)
    res.json(apps)
  })
})

router.route('/activities/:name')
.delete(launcher.close)
.post(launcher.start)

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
