'use strict'
/* global angular, toastr */

angular.module('Dashboard')
.factory('App', ['$http', '$sce', '$location',
function AppFactory ($http, $sce, $location) {
  var self = {}

  self.get = function (app) {
    return $http.get('/apps/' + app).error(function (data) {
      console.log(data.toString())
      toastr.error(data.toString())
      $location.path('/')
      $location.replace()
    })
  }

  self.all = function () {
    return self.get('')
  }

  self.getReadme = function (app) {
    return $http.get('/apps/' + app + '/readme')
    .error(function (data) {
      toastr.error(data)
    })
  }

  self.update = function (app, pkg) {
    return $http.put('/apps/' + app, pkg)
    .error(function (data, status) {
      toastr.error(data)
    })
  }

  self.remove = self.delete = function (app) {
    return $http.delete('/apps/' + app)
    .error(function (data, status) {
      toastr.error(data)
    })
  }

  return self
}])
