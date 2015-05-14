var express = require('express');
var request = require('request');
var fs = require('fs-extra');
var sha1 = require('sha1');
var router = express.Router();

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
			fs.writeJsonSync('./user.json', body);
	}).pipe(response); 
});

router.get('/logout', function(req, res) {
	res.json(req.body);
});

module.exports = router;
