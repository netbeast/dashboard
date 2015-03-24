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
var Helper = require('./Helper');
var path = require('path');

var CHILDREN = {};  //apps with their child object

Launcher = {};

Launcher.start = function(req, res) {
  var app = req.params.name;
  var ROOT = path.join(__dirname, './sandbox', app);
  var entryPoint = path.join(ROOT, Helper.getAppPkgJSON(app).main);
  if (!CHILDREN[app]) {
    console.log('\nLaunching '+ app + ' @\n' + ROOT + '\n');
    var child = spawn(entryPoint, ['--port', 31416], {
      cwd: ROOT
    });

    CHILDREN[app] = child;
    console.log('Running apps with pid=' + CHILDREN[app].pid);

    //child management
    child.unref(); //parent does not wait for it to finish
    child.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    child.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    child.on('close', function (code) {
      console.log('child process exited with code ' + code);
      CHILDREN[app] = undefined;
    });
  }
}

Launcher.close = function (req, res) {
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

Launcher.getApps = function() {
  var data = [];
  Helper.getAppsJSON().forEach(function (app) {
    if(CHILDREN[app.name]) {
      data.push(app);
    }
  });
  return data;
}

module.exports = Launcher;
