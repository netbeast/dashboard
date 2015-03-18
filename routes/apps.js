var express = require('express');
var fs = require('fs');
var path = require("path");
var router = express.Router();

// GET
var dir = './sandbox'
router.get('/apps', function(req, res) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      throw err;
    } else {
      // dashboard expects an apps array
      var data = [];
      files.forEach(function(file) {
        data.push({name: file});
      });
      res.json(data);
    }
  });
});

router.get('/apps/:name', function(req, res) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      throw err;
    } else {
      if(files.indexOf(req.params.name) != -1) {
        // If the app exists:
        var data = {name: req.params.name, description: 'mockup description'};
        res.json(data);
      } else {
        res.status(404).json('Not Found');
      }
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
