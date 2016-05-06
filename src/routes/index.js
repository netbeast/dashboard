var express	 = require('express')
var router = express.Router()

router.use(require('./apps'))
router.use(require('./activities'))
// API routes
router.use(require('./resources'))
router.use(require('./scene'))
router.use(require('./topic'))

module.exports = router
