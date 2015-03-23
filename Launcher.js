var exec = require('child_process').exec, child;
var Helper = require('./Helper');
var path = require('path');

var LAUNCHED = [];

Launcher = {};

Launcher.launch = function(app) {
  var ROOT = path.join(__dirname, './sandbox', app);
  if(LAUNCHED.indexOf(app) === -1) {
    LAUNCHED.push(app);
    console.log('\nLaunching '+ app + ' @\n' + ROOT + '\n');
    child = exec('cd ' + ROOT + '; npm start',
     function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
        var appIdx = LAUNCHED.indexOf(app);
        if(appIdx !== -1) {
          LAUNCHED.splice(appIdx, 1);
        }
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
  console.log('Launcher.getApps(): ' + LAUNCHED);
  console.log('Launcher.getApps(): ' + data);
  return data;
}

module.exports = Launcher;
