var express = require('express');
var router = express.Router();
var Helper = require('../helper');

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
  if(req.body.gitURL) {
    require('../installer').git(req, res);
  } else {
    console.log("Installer.multer() processing data...");
    console.log(req.body);
    console.log(req.files);
  }
});

// DELETE
router.delete('/apps/:name', function(req, res) {
  Helper.deleteApp(req.params.name, function(){
    res.status(204).json('The app was deleted');
  }, function() {
    res.status(404).json('The app was not found');
  });
});

// Util
//============
router.get('/routes', function(req, res) {
  res.json(router.stack);
});

module.exports = router;
