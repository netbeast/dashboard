
var url = require('url')

var express = require('express')
var httpProxy = require('http-proxy')
var chalk = require('chalk')

var Activity = require('../models/activity')
// var broker = require('../helpers/broker')

var router = module.exports = express.Router()

var proxy = httpProxy.createProxyServer({ ws: true })

proxy.on('error', function (err, req, res) {
  if (err.code === 'ECONNRESET') {
    console.log(chalk.grey('ECONNRESET'))
    return res.end()
  } else {
    return console.trace(err)
  }
})

// This route is higher priority
router.use('/i/:name', function (req, res, next) {
  // This block returns an app object
  // with the port where it is running
  const app = Activity.get(req.params.name)

  if (!app) return next()

  // Here app is running
  // In case the path is /i/:name
  // instead of /i/:name/ you need this block
  const pathname = req.url.replace('/i/' + app.name, '/')

  // This block of code actually pipes the request
  // to the running app and pass it to the client
  var proxyUrl = req.protocol + '://localhost:' + app.port

  req.url = pathname

  proxy.web(req, res, { target: proxyUrl })
})

router.use(function (req, res, next) {
  // Capture the referer to proxy the request
  // in case the path is not clear enaugh

  const referer = req.get('referer')
  if (referer === undefined) return next()
  if (req.url.split('/')[1] === 'api') return next()
  if (req.url === url.parse(referer).pathname) return next()

  const refererPathname = url.parse(referer).pathname || ''
  var aux = refererPathname.split('/')
  req.referer = aux[aux.indexOf('i') + 1]

  const app = Activity.get(req.referer)
  if (!app) return next()

  const pathname = req.url.replace('/i/', '/').replace('/' + app.name, '')

  // This block of code actually pipes the request
  // to the running app and pass it to the client
  var proxyUrl = req.protocol + '://localhost:' + app.port
  console.log('[proxy -> %s%s]', proxyUrl, pathname)

  req.url = pathname

  proxy.web(req, res, { target: proxyUrl })
})
