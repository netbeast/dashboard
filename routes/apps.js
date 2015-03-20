var express = require('express');
var fs = require('fs');
var path = require("path");
var router = express.Router();
var glob = require('glob');


var DIR = path.join(__dirname, '/../sandbox');

// GET
router.get('/apps', function(req, res) {

  // dashboard expects an apps array
  var data = [];
  var package_json;

  fs.readdir(DIR, function (error, files) {
    if (error) {
      res.status(500).json('Could not read ' + DIR);
      throw err;
    }

    files.forEach(function(file) {
      SEARCH = DIR + '/?**/package.json';
      // find all package.json
      // the '?' char means ONLY first ocurrence in search
      // which is the main package.json we are searching
      result = glob.sync(SEARCH)[0];
      package_json = JSON.parse(fs.readFileSync(result, 'utf8'));
      console.log('Package name: ' + package_json.name);
      data.push({name: package_json.name});
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

    if( app_index != -1) {
      // Now check if the app exists
      var package_json, PATH = path.join(DIR, files[app_index], 'package.json');
      package_json = JSON.parse(fs.readFileSync(PATH, 'utf8'));
      console.log('Package name: ' + package_json.name);
      res.json(package_json);
    } else {
      res.status(404).json('Not Found');
    }
  });
});

// CREATE
router.post('/apps', function(req, res){
  console.log(req.body);
  console.log(req.files);
  res.status(204).end();
});

// DELETE


module.exports = router;
