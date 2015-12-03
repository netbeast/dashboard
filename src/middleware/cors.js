var express	 = require('express')
var router = express.Router()

/* Allow CORS */
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Access-Control-Allow-Origin, Content-Type, Accept')
  next()
})

module.exports = router
