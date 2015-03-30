(function() {
  var childProcess = require("child_process");
  oldSpawn = childProcess.spawn;
  function mySpawn() {
    console.log('spawn called');
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
})();

var spawn = require('child_process').spawn;
var portfinder = require('portfinder');
var helper = require('./helper');
var path = require('path');

portfinder.basePort = 3000;
// Apps with their child object running
var CHILDREN = {};

Launcher = {};

Launcher.start = function(req, res) {

  var app = req.params.name;
  var appRoot = path.join(helper.SANDBOX, app);
  var entryPoint = path.join(appRoot, helper.getAppPkgJSON(app).main);

  if (!CHILDREN[app]) {

    portfinder.getPort(function (err, port) {
      if(err) {
        res.status(404).json("Not enaugh ports");
        return;
      } else {

        var child = spawn(entryPoint, ['--port', port], {
          cwd: appRoot
        });

        CHILDREN[app] = child;
        CHILDREN[app].port = port;
        console.log('Running apps with pid=' + CHILDREN[app].pid);

        //child management
        child.unref(); //parent does not wait for it to finish
        child.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
          res.json({port: port});
        });

        child.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });

        child.on('close', function (code) {
          console.log('child process exited with code ' + code);
          CHILDREN[app] = undefined;
        });

        child.on('error', function (error) {
          console.log('ERROR: Launcher.start('+ entryPoint +')' + error);
          res.status(500).send('Launcher.start('+ app +'): \n' + error);
        });
      }
    });
  } else {
    res.json({port: CHILDREN[app].port});
  }
}

Launcher.stop = function (req, res) {
  var app = req.params.name;
  if (CHILDREN[app]) {
    console.log('Sending SIGTERM to ' + app);
    CHILDREN[app].kill('SIGTERM');
    CHILDREN[app] = undefined;
    res.status(204).json("Signal sent");
  } else {
    res.status(404).json("Not Found");
  }
}

// Launcher.open = function(req, res) {
//   var app = req.params.name;
//   if (CHILDREN[app].port) {
//     res.redirect()
//   } else {
//     res.status(404).json("Not Found");
//   }
// }

Launcher.getApps = function() {
  var data = [];
  helper.getAppsJSON().forEach(function (app) {
    if(CHILDREN[app.name]) {
      data.push(app);
    }
  });
  return data;
}

module.exports = Launcher;
