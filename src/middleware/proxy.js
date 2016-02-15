
var url = require('url')

var express = require('express')
var httpProxy = require('http-proxy')

var Activity = require('../models/activity')
// var broker = require('../helpers/broker')

var router = module.exports = express.Router()

var proxy = httpProxy.createProxyServer({ ws: true })

// proxy.on('error', function (err) {
//   broker.error(err.message, 'Proxy error')
// })

router.use('/live/:name?', function (req, res, next) {
  // Capture the referer to proxy the request
  // in case the path is not clear enaugh
  if (req.get('referer') === undefined) return next()

  const pathname = url.parse(req.get('referer')).pathname

  var aux = pathname.split('/')
  console.log('pathname', pathname)
  aux = aux[aux.indexOf('live') + 1]

  req.referer = aux
  return next()
})

router.use('/live/:name?', function (req, res) {
  // This block returns an app object
  // with the port where it is running
  const app = Activity.get(req.params.name) || Activity.get(req.referer)

  if (!app) return res.status(404).send('App not running')

  const originalUrl = url.parse(req.originalUrl)
  console.log('originalUrl', originalUrl)

  // Here app is running
  // In case the path is /i/:name
  // instead of /i/:name/ you need this block
  var reqUrl = req.originalUrl.replace('/live/', '/')
  reqUrl = reqUrl.replace('/' + app.name, '')

  // This block of code actually pipes the request
  // to the running app and pass it to the client
  var proxyUrl = req.protocol + '://localhost:' + app.port
  req.url = reqUrl

  console.log('proxyUrl', proxyUrl)
  console.log('req.url', req.url)
  console.log('req.referer', req.referer)

  // Allow CORS on all plugins
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Access-Control-Allow-Origin, Content-Type, Accept')
  res.header('Access-Control-Allow-Origin', '*')

  // This block prevents iframe caching
  proxy.web(req, res, { target: proxyUrl })
})
