var App = require('../models/app')
var express = require('express')
var router = express.Router()

// Activities
// ==========
router.get('/topics', function (req, res, next) {
  App.find({ topic: 'lights' }, function (err, apps) {
    if (err) return next(err)
    res.json(apps)
  })
})

module.exports = router
