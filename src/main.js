var express = require('express')
, path = require('path')
, fs = require('fs-extra')
, favicon = require('serve-favicon')
, logger = require('morgan')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser');

// Config variables
var config = require('./config');

// Needed for the installation
var installer = require('./installer');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(config.publicDir, 'img/xway.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(config.publicDir));


app.get('/config', function (req, res) {
	res.status("200").json(config);
});
app.get('/routes', function(req, res) {
 	res.json(router.stack);
});
app.get('/skip', function(req, res) {
	fs.writeJsonSync('./user.json', {
		email: 'none',
		alias: 'none'
	});
	res.status(301).redirect('/');
});

/* Configure the multer for file uploads */
app.use('/apps', installer.multer);
app.use('/', require('./routes/apps'));
app.use('/', require('./routes/users'));
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

module.exports = app;
