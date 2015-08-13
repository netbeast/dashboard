var launcher = require('../launcher')
, express = require('express')
, router = express.Router()

// Activities
//===========
router.get('/activities', function(req, res) {
  res.json(launcher.getApps())
})
router.delete('/activities/:name', launcher.close)
router.put('/activities/:name', launcher.start)
router.put('/launch/:name', launcher.start) // Alias


module.exports = router
