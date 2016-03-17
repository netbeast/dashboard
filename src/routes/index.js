var express	 = require('express')
var router = express.Router()

/* Allow CORS */
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Access-Control-Allow-Origin, Content-Type, Accept')
  next()
})

router.use(require('./apps'))
router.use(require('./misc'))
router.use(require('./plugins'))
router.use(require('./topics'))
router.use(require('./activities'))
// API routes
router.use(require('./resources'))
router.use(require('./scene'))

module.exports = router
