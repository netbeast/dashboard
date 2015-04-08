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
var events = require('events');
var www = require('../www');
var path = require('path');

portfinder.basePort = 3000;
// Apps with their child object running
var children = {};

var launcher = new events.EventEmitter();

launcher.on('start', function(app) {

  if (children[app.name]) {
    return;
  }

  var appRoot = path.join(helper.SANDBOX, app.name);
  var entryPoint = path.join(appRoot, 
    helper.getAppPkgJSON(app.name).main);

  child = spawn(entryPoint, ['--port', app.port], {
    cwd: appRoot
  });

  //child management
  child.unref(); //parent does not wait for it to finish
  child.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    app.io.emit('stdout', '' + data);
  });
  child.stderr.on('data', function (data) {
    console.error('stderr: ' + data);
    app.io.emit('stderr', '' + data);
  });
  child.on('close', function (code) {
    app.io.emit('close', ' process exited with code ' + code);
    console.log('child process exited with code ' + code);
    children[app] = undefined;
  });
  child.on('error', function (code) {
    app.io.emit('stderr', '' + error);
    children[app] = undefined;
    console.error('' + error);
  });
  children[app.name] = child;
  children[app.name].port = app.port;
});

launcher.start = function(req, res) {

  var child = undefined;
  var app = { 
    name: req.params.name,
    port: undefined,
    io: undefined
  };

  if (!children[app]) {

    portfinder.getPort(function (err, port) {
      if(err) {
        res.status(404).json("Not enough ports");
        return;
      } else {
        children[app] = app; //provisional
        app.port = port;
        res.status(200).json({port: app.port});
        // Web Socket to publish app output
        app.io = www.io.of('/' + app.name)
        .on('connection', function (socket) {
          socket.emit('hello');
          console.log('ws/%s: client fetched!', app.name);
          launcher.emit('start', app);
        });
      }
    });
  } else {
    res.status(200).json({port: children[app].port});
  }
}

launcher.close = function (req, res) {
  launcher.stop(req.params.name, function (err) {
    if (err) {
      res.send(403).json('' + err);
    } else {
      res.send(200).json('App closed');
    }
  });
}

launcher.stop = function (app, callback) {
  var err = undefined;
  if (children[app]) {
    console.log('Sending SIGTERM to ' + app);
    children[app].kill('SIGTERM');
    children[app] = undefined;
  } else {
    err = 'Activity ' + app + ' was not found';
  }
  callback.call(this, err);
}

launcher.getApps = function() {
  var data = [];
  helper.getAppsJSON().forEach(function (app) {
    if(children[app.name]) {
      data.push(app);
    }
  });
  return data;
}

module.exports = launcher;
