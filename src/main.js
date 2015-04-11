var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Config variables
var config = require('./config');

// Needed for the installation
var installer = require('./installer');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(config.publicDir, 'img/favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(config.publicDir));

/* Configure the multer for file uploads */

app.use(installer.multer);
app.use('/', require('./routes/apps'));
app.use('/', require('./routes/activities'));

// error handlers
//===============

// catch 404 and forward to error handler
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

// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   if(!res.headersSent)
//     res.status(500).json('' + err);
//     console.error(err);
// });

module.exports = app;
