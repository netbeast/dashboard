var Activity = require('../models/activity')
var express = require('express')
var router = module.exports = express.Router()

// Activities
// ==========
router.get('/activities', function (req, res, next) {
  Activity.all(function (err, apps) {
    if (err) return next(err)
    res.json(apps)
  })
})

router.route('/activities/:name')
.get(Activity.status)

.delete(function (req, res, next) {
  Activity.stop(req.params.name, function (err) {
    if (err) return next(err)
    res.status(204).end()
  })
})

.post(function (req, res, next) {
  Activity.boot(req.params.name, function (err, child) {
    if (err) return next(err)
    Activity.ready(child, function (err, act) {
      if (err) return next(err)

      res.json({ name: act.name, port: act.port })
    })
  })
})
