var express	 = require('express')
, www		 = require('../../www')
, apps 	 	 = require('./apps')
, users 	 = require('./users')
, spawn		 = require('child_process').spawn
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

router.put('/update', function (req, res) {
	www.io.emit('warning', 'Updating dashboard to last version...');
	child = spawn('git', ['pull']);
  	//child management
  	child.stdout.on('data', function (data) {
  		console.log('%s/stdout: %s', 'xway', data);
  		www.io.emit('stdout', '' + data);
  	});
  	child.stderr.on('data', function (data) {
  		console.log('%s/stderr: %s', 'xway', data);
  		www.io.emit('stderr', '' + data);
  	});
  	child.on('close', function (code) {
  		www.io.emit('close', 'process exited with code %s', code);
  		console.log('child process exited with code %s', code);
  	});
  	child.on('error', function (code) {
  		www.io.emit('stderr', '' + code);
  		console.error('' + code);
  	});
  	res.status("304");
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