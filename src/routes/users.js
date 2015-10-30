var express = require('express')
var client = require('request')
// var crypto = require('crypto')
var router = express.Router()

const API_URL = 'https://market.netbeast.co'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

router.post('/login', function (req, res, next) {
  // var md5 = crypto.createHash('md5')
  // md5.update(req.body.password)

  client.post(API_URL + '/login', { json: req.body }, function (err, resp, body) {
    if (err) return next(err)
  }).pipe(res)
})

router.post('/signup', function (req, res, next) {
  client.post(API_URL + '/signup', { json: req.body }, function (err, resp, body) {
    if (err) return next(err)
  }).pipe(res)
})

router.get('/sessions', function (req, res, next) {
  client(API_URL + '/sessions', function (err, resp, body) {
    if (err) return next(err)
  }).pipe(res)
})

module.exports = router
