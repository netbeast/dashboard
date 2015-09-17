'use strict'

var io = require('../lib/socket.io')

angular.module("Dashboard")
.factory("Activities", ['$http', '$sce',  
  function ActivitiesFactory ($http, $sce) {

    var self = {}
    self.all = function() {
      return $http.get('/activities/')
    }
    self.stop = function(app) {
      return $http.delete('/activities/' + app)
      .success(function(data, status) {
        toastr.success(app + " succesfully stopped")
        var icon = document.getElementById(app)
        icon.parentElement.removeChild(icon)
      })
      .error(function(data, status) {
        toastr.error(data, 'An error has occurred when stopping the app')
        console.error(__filename + ' @ self.stop()')
        console.log(data)
      })
    }
    self.open = function(scope, app) {
      $http.get('/apps/' + app + '/port').
      success(function(data, status) {
        console.log('GET /apps/' + app + '/port ->' + data)
        scope.url = 'http://' + window.location.host + ':' + data
        scope.href = $sce.trustAsResourceUrl(scope.url)
      }).
      error(function(data, status, headers, config) {
        console.error(data)
        window.location.assign("/")
      })
    }
    self.launch = function(scope, app) {
      return $http.post('/activities/' + app).
      success(function(data, status, headers, config) {
        if (data.port) {
          scope.href = 'http://' + window.location.host + ':' + data.port
          return
        }
      // Force new connection after disconnect to
      // restart app
      var ws
      ws = io.connect('/' + app, {'forceNew': true})
      .on('connection', function () {
        console.log('ws/%s: server fetched.', app)
      })
      .on('stdout', function (stdout) {
        toastr.info(stdout, app)
        console.log('ws/%s/stdout: %s', app, stdout)
      })
      .on('stderr', function (stderr) {
        toastr.error(stderr, app)
        console.log('ws/%s/stderr: %s', app, stderr)
      })
      .on('close', function() {
        console.log('ws/%s/close!', app)
        ws.close().disconnect()
      })
      .on('ready', function (port) {
        console.log('ws/%s/ready!')
        scope.href = 'http://' + window.location.host + ':' + port
      })

    }).error(function(data, status, headers, config) {
      toastr.error('Dashboard', data)
      console.log(status + ' when PUT /launch/' + app + ' -> ' + data)
    })
  }

  return self
}])