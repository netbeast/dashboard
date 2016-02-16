
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

router.use(function (req, res, next) {
  // Capture the referer to proxy the request
  // in case the path is not clear enaugh

  const referer = req.get('referer')
  if (referer === undefined) return next()
  if (req.url === url.parse(referer).pathname) return next()

  const refererPathname = url.parse(referer).pathname || ''
  var aux = refererPathname.split('/')
  req.referer = aux[aux.indexOf('live') + 1]

  const app = Activity.get(req.referer)
  if (!app) return next()

  const pathname = req.url.replace('/live', '').replace('/' + app.name, '')

  // This block of code actually pipes the request
  // to the running app and pass it to the client
  var proxyUrl = req.protocol + '://localhost:' + app.port

  req.url = pathname

  console.log('================================')
  console.log('* MIDDLEWARE')
  console.log('proxyUrl =', proxyUrl)
  console.log('pathname =', pathname)
  console.log('req.url =', req.url)
  console.log('req.referer =', req.referer)
  console.log('================================')

  // Allow CORS on all plugins
  allowCORS(res)

  console.log('REQUEST SENT')
  proxy.web(req, res, { target: proxyUrl })
})

router.use('/live/:name', function (req, res) {
  // This block returns an app object
  // with the port where it is running
  const app = Activity.get(req.params.name)

  if (!app) return res.status(404).send('App not running')

  console.log('originalUrl =', req.url)

  // Here app is running
  // In case the path is /live/:name
  // instead of /live/:name/ you need this block
  const pathname = req.url.replace('/live', '').replace('/' + app.name, '')

  // This block of code actually pipes the request
  // to the running app and pass it to the client
  var proxyUrl = req.protocol + '://localhost:' + app.port + pathname

  console.log('================================')
  console.log('LIVE MIDDLEWARE')
  console.log('proxyUrl =', proxyUrl)
  console.log('pathname =', pathname)
  console.log('req.url =', req.url)
  console.log('req.referer =', req.referer)
  console.log('================================')

  // Allow CORS on all plugins
  allowCORS(res)

  console.log('REQUEST SENT', req.url)
  proxy.web(req, res, { target: proxyUrl })
})

function allowCORS (res) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Access-Control-Allow-Origin, Content-Type, Accept')
  res.header('Access-Control-Allow-Origin', '*')
}
