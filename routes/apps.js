var express = require('express');
var router = express.Router();

/* GET apps listing. */
router.get('/', function(req, res, next) {
   res.render('apps/index', { title: 'Apps' });
});

module.exports = router;
