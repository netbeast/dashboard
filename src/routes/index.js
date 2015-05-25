var express	 = require('express')
, apps 	 	 = require('./apps')
, users 	 = require('./users')
, config 	 = require('../../config')
, activities = require('./activities');

var router = express.Router();

router.get('/routes', function (req, res) {
	var stack = [].concat(
		activities.stack
		, apps.stack
		, users.stack
		, router.stack
		);
	res.status("200").json(stack);
});

router.get('/config', function (req, res) {
	res.status("200").json(config);
});

router.post('/update', function (req, res) {
	res.status("200").json(config);
});

router.get('/skip', function(req, res) {
	require('fs-extra')
	.writeJsonSync('./config/user.json', {
		email: null,
		alias: null
	});
	res.status(301).redirect('/');
});

router.use('/', apps);
router.use('/', users);
router.use('/', activities);

module.exports = router;