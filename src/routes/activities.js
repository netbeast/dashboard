var express = require('express');
var router = express.Router();
var launcher = require('../launcher');

// Activities
//===========
router.get('/activities', function(req, res) {
  res.json(launcher.getApps());
});

router.put('/launch/:name', function(req, res) {
    launcher.start(req, res);
});

router.delete('/activities/:name', function(req, res) {
    launcher.stop(req, res);
});

module.exports = router;
