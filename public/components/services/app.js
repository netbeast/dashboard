'use strict'
/* global angular, toastr */

angular.module('Dashboard')
.factory('App', ['$http', '$sce', '$location',
function AppFactory ($http, $sce, $location) {
  var self = {}

  self.get = function (app) {
    return $http.get('/apps/' + app)
  }

  self.all = function () {
    return self.get('')
  }

  self.getReadme = function (app) {
    return $http.get('/apps/' + app + '/readme')
  }

  self.update = function (app, pkg) {
    return $http.put('/apps/' + app, pkg)
  }

  self.remove = self.delete = function (app) {
    return $http.delete('/apps/' + app)
  }

  self.install = function (url) {
    if (!url) {
      return toastr.warning('Git Repo URL field is empty')
    }
    return $http.post('/apps', {url: url})
  }

  return self
}])
