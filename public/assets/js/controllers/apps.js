'use strict'

var helper = require('../helpers')
var Dropzone = require('Dropzone')

angular.module('Dashboard')

.controller('AppsShowCtrl', [
  '$scope', '$routeParams', 'Apps', 'Activities', '$sce',
  function($scope, $routeParams, Apps, Activities, $sce) {
    var appName = $routeParams.name
    helper.setNavColor('blue')
    helper.setTitle(appName)
    Apps.getReadme(appName).success(function(data) {

      $scope.readme = $sce.trustAsHtml(data)
    }) 
    
    Apps.get(appName).success(function(data) {
      $scope.app = data
    })

    Activities.launch(appName)
    .success(function (data) {
      $scope.href = 'http://' + window.location.host + ':' + data.port
    })
  }])

.controller('AppsListCtrl', ['$scope', 'Apps',
  function ($scope, Apps) {
    helper.setTitle('Your apps drawer')
    helper.setNavColor('blue')
    Apps.all().success(function(data) {
      $scope.apps = data
    })
  }])

.controller('AppsRmCtrl', ['$scope', 'Apps',
  function ($scope, Apps) {
    helper.setTitle('Uninstall apps')
    helper.setNavColor('red')
    Apps.all().success(function(data) {
      $scope.apps = data
    })
  }])

.controller('AppsNewCtrl', ['$scope', '$routeParams', '$http',  '$location',
  function($scope, $routeParams, $http, $location) {

    helper.hideNav()
    helper.setTitle('Install a new app')

    var dz = new Dropzone(".dropzone", {
      url: "/apps",
      maxFiles: 1,
      accept: function(file, done) {
        var fname = file.name
        var ext = [fname.split('.')[1], fname.split('.')[2]].join('.')
        if(ext === 'tar.gz' || ext === 'tgz.') {
          console.log('Uploading file with extension ' + ext)
          done()
        } else {
          done('Invalid file type. Must be a tar.gz')
          this.removeFile(file)
        }
      }
    })

    dz.on("error", function(file, error, xhr) {
      toastr.error(error)
      dz.removeFile(file)
    })

    dz.on("processing", function(file, response) {
      $location.path("/")
    })
  }])