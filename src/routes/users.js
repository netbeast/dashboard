var express = require('express')
var client = require('request')
var crypto = require('crypto')
var router = express.Router()

const API_URL = 'https://market.netbeast.co'

// Users
// =====
router.post('/login', function (req, res, next) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  var md5 = crypto.createHash('md5')
  md5.update(req.body.password)
  var opts = {
    json: {
      email: req.body.email,
      password: md5.digest('hex')
    }
  }

  client.post(API_URL + '/login', opts, function (err, resp, body) {
    if (err) return next(err)
  }).pipe(res)
})

module.exports = router
