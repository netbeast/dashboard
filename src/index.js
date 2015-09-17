var express = require('express')
, path = require('path')
, fs = require('fs-extra')
, logger = require('morgan')
, config = require('../config')
, favicon = require('serve-favicon')
, bodyParser = require('body-parser')

var app = module.exports = express()

app.use(favicon(path.join(config.publicDir, 'img/xway.png')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(config.publicDir))

app.use(require('./routes'))

// error with Error classes
//=========================
app.use(function(err, req, res, next) {  
	console.error(err.stack)
	if (!err.statusCode || err.statusCode === 500)
		fs.writeJson('./error-report', {err: err, req: req})

	res.status(err.statusCode || 500).send(err.message)
})
