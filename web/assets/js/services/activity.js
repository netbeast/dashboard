'use strict'

/* global angular, toastr */

angular.module('Dashboard')
.factory('Activity', ['$http', '$sce', '$location',
function ActivityFactory ($http, $sce, $location) {
  var self = {}
  self.all = function () {
    return $http.get('/activities/').error(function (data) {
      toastr.error(data)
    })
  }

  self.stop = function (app) {
    return $http.delete('/activities/' + app)
    .success(function (data, status) {
      toastr.success(app + ' succesfully stopped')
      var icon = document.getElementById(app)
      icon.parentElement.removeChild(icon)
    })
    .error(function (data, status) {
      toastr.error(data, 'An error has occurred when stopping the app')
      console.error(__filename + ' @ self.stop()')
      console.log(data)
    })
  }

  self.open = function (app) {
    return $http.get('/activities/' + app)
    .error(function (data, status, headers, config) {
      toastr.error(data)
      console.error('%s %s', status, data)
      $location.path('/')
      $location.replace()
    })
  }

  self.launch = function (app) {
    return $http.post('/activities/' + app)

    .error(function (data, status, headers, config) {
      toastr.error(data, 'Dashboard')
      console.log(status + ' when PUT /launch/' + app + ' -> ' + data)
    })
  }

  return self
}])
