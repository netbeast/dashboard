var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// Needed for the installation
//============================
var fs = require('fs');         // file system
var glob = require('glob');     // find files
var multer = require('multer'); // uploads
var rimraf = require('rimraf'); // nodejs rm -rf
var targz = require('tar.gz');
var routes = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Configure the multer for file uploads */

var DIR = path.join(__dirname, 'sandbox');
var TMP = path.join(__dirname, 'tmp');
app.use(multer({
  dest: TMP,
  rename: function (fieldname, filename, req, res) {
    return filename;
  },
  onFileUploadStart: function (file, req, res) {
    console.log('Upload mimetype: ' + file.mimetype);
    var fname = file.name;
    var ext = [fname.split('.')[1], fname.split('.')[2]].join('.');
    if(ext === 'tar.gz' || ext === 'tgz.' || ext === 'zip.') {
      console.log('Uploading file with extension ' + ext);
    } else {
      res.status(403).json('Invalid file type. Must be a zip or tar.gz');
      return false;
    }
  },
  onFileUploadComplete: function (file, req, res) {
    var tarball = path.join(TMP, file.name);
    var extract = new targz().extract(tarball, TMP,
      function(extractError){
        if(extractError) {
          console.log(extractError);
          res.status(500).json("Could not install the app");
        } else {
          console.log('The extraction has ended!');

          // Now check if the app exists
          var result, package_json,
          SEARCH = TMP + '/?**/package.json';
          // find all package.json
          // the '?' char means ONLY first ocurrence in search
          result = glob.sync(SEARCH)[0];

          if (result) {
            package_json = JSON.parse(fs.readFileSync(result, 'utf8'));
            //Move the folder from tmp to the sandbox
            app_root = path.join(DIR, '/' + package_json.name);
            if(!fs.existsSync(app_root)) {
              fs.renameSync(result.substring(0, result.lastIndexOf("/")),
              app_root);
              res.status(204).json("File uploaded");
            } else {
              console.log("App already exists");
              res.status(403).json("App already exists");
            }
          } else {
            console.log("App does NOT have package.json file");
            res.status(403).json("App does NOT have package.json file");
          }

          // Now remove tmp files
          rimraf(tarball.split('.')[0] + '*',
          function(rimrafError) {
            if (rimrafError) {
              console.log(rimrafError);
            } else {
              console.log("Dir \"" + TMP + "\" was removed");
            }
          });
        }
      });
    }
  }));

  app.use('/', routes);

  // error handlers
  //===============

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });


  module.exports = app;
