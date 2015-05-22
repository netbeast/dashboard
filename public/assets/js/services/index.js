'use strict';

angular.module("Dashboard")
.factory("Activities", ['$http', 'toastr', 
  function ActivitiesFactory ($http, toastr) {

    var self = {}
    self.all = function() {
      return $http.get('/activities/');
    };
    self.stop = function(app) {
      return $http.delete('/activities/' + app)
      .success(function(data, status) {
        toastr.success(app + " succesfully stopped");
        var icon = document.getElementById(app);
        icon.parentElement.removeChild(icon);
      })
      .error(function(data, status) {
        toastr.error(data, 'Server responded with status ' + status);
        console.error(__filename + ' @ self.stop()');
        console.log(data);
      });
    };
    self.launch = function(scope, app) {
      return $http.put('/launch/' + app).
      success(function(data, status, headers, config) {
        if (data.port) {
          scope.href = 'http://' + window.location.host + ':' + data.port;
          return;
        }
      // Force new connection after disconnect to
      // restart app
      var ws, io = require('../lib/socket.io');
      ws = io.connect('/' + app, {'forceNew': true})
      .on('connection', function () {
        console.log('ws/%s: server fetched.', app);
      })
      .on('stdout', function (stdout) {
        toastr.info(stdout, app);
        console.log('ws/%s/stdout: %s', app, stdout);
      })
      .on('stderr', function (stderr) {
        toastr.error(stderr, app);
        console.log('ws/%s/stderr: %s', app, stderr);
      })
      .on('close', function() {
        console.log('ws/%s/close!', app);
        ws.close().disconnect();
      })
      .on('ready', function (port) {
        console.log('ws/%s/ready!');
        scope.href = 'http://' + window.location.host + ':' + port;
      });

    }).error(function(data, status, headers, config) {
      toastr.error('Dashboard', data);
      console.log(status + ' when PUT /launch/' + app + ' -> ' + data);
    });
  };

  return self;
}]);