var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var glob = require('glob');
var rimraf = require('rimraf');


var DIR = path.join(__dirname, '/../sandbox');

// GET
router.get('/apps', function(req, res) {

  // dashboard expects an apps array
  var data = [];
  var packageJSON;

  fs.readdir(DIR, function (error, files) {
    if (error) {
      res.status(500).json('Could not read ' + DIR);
      throw err;
    }

    files.forEach(function(file) {
      PATH = path.join(DIR, file, 'package.json');
      if (fs.existsSync(PATH)) {
        packageJSON = JSON.parse(fs.readFileSync(PATH, 'utf8'));
        data.push({name: packageJSON.name});
      }
    });

    res.json(data);
  });
});

router.get('/apps/:name', function(req, res) {
  var app_index = -1; // err by default

  fs.readdir(DIR, function (error, files) {
    if (error) {
      res.status(500).json('Could not read ' + DIR);
      throw error;
    }

    app_index = files.indexOf(req.params.name);

    if (app_index != -1) {
      var packageJSON, PATH = path.join(DIR, files[app_index], 'package.json');
      packageJSON = JSON.parse(fs.readFileSync(PATH, 'utf8'));
      res.json(packageJSON);
    } else {
      res.status(404).json('Not Found');
    }
  });
});

// CREATE
router.post('/apps', function(req, res){
  console.log(req.body);
  console.log(req.files);
  //res.status(204).end();
});

// DELETE
router.delete('/apps/:name', function(req, res) {
  var app_index = -1; // err by default

  fs.readdir(DIR, function (error, files) {
    if (error) {
      res.status(500).json('Could not read ' + DIR);
      throw error;
    }

    app_index = files.indexOf(req.params.name);

    if( app_index != -1) {
      var PATH = path.join(DIR, files[app_index]);
      rimraf(PATH, function(rimrafError) {
        if (rimrafError) {
          console.log(rimrafError);
        } else {
          res.status(204).json('App removed');
          console.log("Dir \"" + PATH + "\" was removed");
        }
      });
    } else {
      res.status(404).json('The app was not found');
    }
  });
});


module.exports = router;
