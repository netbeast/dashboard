var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var rimraf = require('rimraf');
var Launcher = require('./Launcher');
var Helper = require('./Helper');

var DIR = path.join(__dirname, './sandbox');

// GET
router.get('/apps', function(req, res) {
  res.json(Helper.getAppsJSON());
});

router.get('/apps/:name', function(req, res) {
  var packageJSON = undefined; // err by default

  packageJSON = Helper.getAppPkgJSON(req.params.name);

  if (packageJSON !== undefined) {
    res.json(packageJSON);
  } else {
    res.status(404).json('Not Found');
  }
});

// CREATE
router.post('/apps', function(req, res){
  console.log(req.body);
  console.log(req.files);
  //res.status(204).end();
});

// DELETE
router.delete('/apps/:name', function(req, res) {

  Helper.deleteApp(req.params.name, function(){
    res.status(204).json('The app was deleted');

  }, function() {
    res.status(404).json('The app was not found');
  });

});

// Activities
//===========
router.get('/activities', function(req, res) {
  res.json(Launcher.getApps());
});

router.get('/launch/:name', function(req, res) {
    Launcher.launch(req, res);
});

module.exports = router;
