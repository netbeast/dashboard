var launcher = require('../launcher')
var express = require('express')
var router = express.Router()

// Activities
// ==========
router.get('/activities', function (req, res) {
  res.json(launcher.getApps())
})
router.delete('/activities/:name', launcher.close)
router.post('/activities/:name', launcher.start)
router.put('/launch/:name', launcher.start) // Alias

module.exports = router
