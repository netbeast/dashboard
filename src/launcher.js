var spawn = require('child_process').spawn
, portfinder = require('portfinder')
, config = require('./config')
, helper = require('./helper')
, events = require('events')
, www = require('../www')
, path = require('path');

portfinder.basePort = 3000;
// Apps with their child object running
var children = {};

var launcher = new events.EventEmitter();

launcher.on('start', function(app) {

  if (children[app.name]) {
    return;
  }

  var appRoot = path.join(config.appsDir, app.name);
  var entryPoint = path.join(appRoot, 
    helper.getAppPkgJSON(app.name).main);
  console.log('-Launching %s...', app.name);
  child = spawn(entryPoint, ['--port', app.port], {
    cwd: appRoot
  });
  //child management
  child.unref(); //parent does not wait for it to finish
  child.stdout.on('data', function (data) {
    console.log('%s/stdout: %s', app.name, data);
    app.io.emit('stdout', '' + data);
    app.io.emit('ready', app.port);
  });
  child.stderr.on('data', function (data) {
    console.error('%s/stderr: %s', app.name, data);
    app.io.emit('stderr', '' + data);
  });
  child.on('close', function (code) {
    app.io.emit('close', 'process exited with code %s', code);
    console.log('child process exited with code %s', code);
    children[app.name] = undefined;
  });
  child.on('error', function (code) {
    app.io.emit('stderr', '' + code);
    children[app.name] = undefined;
    console.error('' + code);
  });
  app.process = child;
  children[app.name] = app;
});

launcher.start = function(req, res) {

  var app = { 
    name: req.params.name,
    process: undefined,
    port: undefined,
    io: undefined
  };

  if (!children[app.name]) {
    console.log('- Looking for a free port for %s...', app.name);
    portfinder.getPort(function (err, port) {
      if(err) {
        res.status(404).json("Not enough ports");
      } else {
        app.port = port;
        console.log('- Found port for %s at %s.', app.name, app.port);
        // Web Socket to publish app output
        app.io = www.io.of('/' + app.name)
        .on('connection', function (socket) {
          console.log('ws/%s: client fetched!', app.name);
          launcher.emit('start', app);
        });
        app.io.emit('ready', app.port);
        res.status(200).json({
          port: undefined
        });
      }
    });
  } else if (children[app.name]) {    
    res.status(200).json({
      port: children[app.name].port
    });
  } else {
    res.status(500).json('- server error at launcher.start %s', app.name);
  }
}

launcher.close = function (req, res) {
  launcher.stop(req.params.name, function (err) {
    if (err) {
      console.trace('' + err);
      res.status(500).json('' + err);
    } else {
      res.status(200).json('App closed');
    }
  });
}

launcher.stop = function (appName, callback) {
  var err = undefined;
  if (children[appName]) {
    console.log('Sending SIGTERM to ' + appName);
    children[appName].process.kill('SIGTERM');
    children[appName] = undefined;
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

launcher.getApp = function(appName) {
  return children[appName];
}

module.exports = launcher;
