/*
  We uses this File to launch the pluging, so you don´t need
  to change nothing.
*/

var express = require('express')
, logger = require('morgan')
, bodyParser = require('body-parser')

var app = module.exports = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Declare where are the routes that the pluging are listening
app.use(require('../routes'))

// error handlers
//===============
app.use(function(req, res, next){
	res.status(404);
  // respond with json
  if (req.accepts('json')) {
  	res.send({ error: 'Not found' });
  	return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});
