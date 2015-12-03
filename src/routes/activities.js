var Activity = require('../models/activity')
var express = require('express')
var request = require('request')
var router = express.Router()

// Activities
// ==========
router.get('/activities', function (req, res, next) {
  Activity.all(function (err, apps) {
    if (err) return next(err)
    res.json(apps)
  })
})

router.route('/activities/:name')
.delete(Activity.close)
.post(Activity.start)
.get(Activity.status)

router.use('/i/:name?', function (req, res) {
  var app, reqUrl, referer, proxyUrl
  // Capture the referer to proxy the request
  // in case the path is not clear enaugh
  if (req.get('referer') !== undefined) {
    var aux = req.get('referer').split('/')
    referer = aux[aux.indexOf('i') + 1]
  }
  // This block returns an app object
  // with the port where it is running
  app = Activity.get(req.params.name) || Activity.get(referer)

  if (!app) {
    return res.status(404).json('App not running')
  }
  // Here app is running
  // In case the path is /i/:name
  // instead of /i/:name/ you need this block

  reqUrl = req.originalUrl.replace('/i/', '/')
  if (referer !== app.name) {
    reqUrl = reqUrl.replace('/' + app.name, '')
  }

  // This block of code actually pipes the request
  // to the running app and pass it to the client
  proxyUrl = req.protocol + '://localhost:' + app.port + reqUrl

  request({
    url: proxyUrl,
    method: req.method,
    qs: req.query,
    json: req.body
  }).pipe(res)
})

module.exports = router
