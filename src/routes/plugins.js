var express = require('express')
var router = module.exports = express.Router()
var App = require('../models/app')

router.route('/plugins')
.get(function (req, res, next) {
	App.plugins(function (err, files) {
		if (err) return next(err)
			res.json(files)
	})
})