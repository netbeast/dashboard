var express = require('express')
, path = require('path')
, fs = require('fs-extra')
, logger = require('morgan')
, config = require('../config')
, favicon = require('serve-favicon')
, bodyParser = require('body-parser')

var app = module.exports = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(config.publicDir, 'img/xway.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(config.publicDir));

app.use(require('./routes'))

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
