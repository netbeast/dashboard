var exec = require('child_process').exec, child;
var Helper = require('./Helper');
var path = require('path');

var LAUNCHED = [];
var PIDS = {};

Launcher = {};

Launcher.launch = function(req, res) {
  var app = req.params.name;
  var ROOT = path.join(__dirname, './sandbox', app);
  if(LAUNCHED.indexOf(app) === -1) {
    LAUNCHED.push(app);
    console.log('\nLaunching '+ app + ' @\n' + ROOT + '\n');
    child = exec('cd ' + ROOT + '; npm start',
     function (error, stdout, stderr) {
      PIDS[app] = child.pid;
      console.log('Running apps with pid=' + PIDS[app]);
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('\nexec error: ' + error+'\n');
        var appIdx = LAUNCHED.indexOf(app);
        if(appIdx !== -1) {
          PIDS[app] = undefined;
          LAUNCHED.splice(appIdx, 1);
        }
        res.status(500).json(String(error));
      }
    });
  }
}

Launcher.getApps = function() {
  var data = [];
  Helper.getAppsJSON().forEach(function (app) {
    var appIdx = LAUNCHED.indexOf(app.name);
    if(appIdx !== -1) {
      data.push(app);
    }
  });
  return data;
}

module.exports = Launcher;
