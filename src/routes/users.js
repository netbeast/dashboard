var express = require('express')
, request = require('request')
, error = require('../error')
, www = require('../../www')
, fs = require('fs-extra')
, sha1 = require('sha1')
, router = express.Router();

// Activities
//===========
router.post('/login', function(req, response) {

	request.post('http://market.netbeast.co/login', {
		json: {
			email: req.body.email,
			password: sha1(req.body.password)
		}
	}, function (err, res, body) {
		if (err) 
			throw err;
		if (res.statusCode === 200)
			fs.writeJsonSync('./config/user.json', body);
	}).pipe(response); 
});

router.get('/logout', function(req, res) {
	fs.remove('./config/user.json', function(err) {
		if (err)
			error.handle(this, err);

		else {
			www.io.emit('success', 'Successfully logged out');
			res.status(304).send();
		}
	});
});

module.exports = router;
