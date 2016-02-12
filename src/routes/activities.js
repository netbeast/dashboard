var Activity = require('../models/activity')
var express = require('express')
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

module.exports = router
