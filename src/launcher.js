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
var www = require('../www');

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
        res.status(404).json("Not enough ports");
        return;
      } else {
        var child = spawn(entryPoint, ['--port', port], {
          cwd: appRoot
        });
        CHILDREN[app] = child;
        CHILDREN[app].port = port;
        res.status(200).json({port: port});
        console.log('Sent 204 JSON ' + {'port': port});
        console.log('Running apps with pid=' + CHILDREN[app].pid);

        // Web Socket to publish app output
        var io = www.io
        .of('/' + app)
        .on('connection', function (socket) {
          socket.emit('hello');
          console.log('ws: client hanged at /' + app);
        });

        //child management
        child.unref(); //parent does not wait for it to finish
        child.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
          io.emit('stdout', '' + data);
        });
        child.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
          io.emit('stderr', '' + data);
        });
        child.on('close', function (code) {
          io.emit('close', ' process exited with code ' + code);
          console.log('child process exited with code ' + code);
          CHILDREN[app] = undefined;
        });
        child.on('error', function (error) {
          console.log('child process exited with code ' + code);
          io.emit('stderr', '' + error);
          CHILDREN[app] = undefined;
        });
      }
    });
    /**
    */
  } else {
      res.status(200).json({port: CHILDREN[app].port});
  }
}

Launcher.close = function (req, res) {
  Launcher.stop(req.params.name, function (err) {
    if (err) {
      res.send(403).json('' + err);
    } else {
      res.send(200).json('App closed');
    }
  });
}

Launcher.stop = function (app, callback) {
  var err = undefined;
  if (CHILDREN[app]) {
    console.log('Sending SIGTERM to ' + app);
    CHILDREN[app].kill('SIGTERM');
    CHILDREN[app] = undefined;
  } else {
    err = 'Activity ' + app + ' was not found';
  }
  callback.call(this, err);
}

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
