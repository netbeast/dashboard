var express	 = require('express')
var router = express.Router()

router.use('/', require('./apps'))
router.use('/', require('./users'))
router.use('/', require('./misc'))
router.use('/', require('./activities'))
// API routes
router.use('/', require('./resource'))
router.use('/', require('./scene'))

module.exports = router
