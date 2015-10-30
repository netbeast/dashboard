/* global angular, toastr,  $ */
'use strict'

var Dropzone = require('Dropzone')

angular.module('Dashboard')

.controller('Apps#show', ['$scope', '$routeParams', 'App', 'Activity', '$sce',
  function ($scope, $routeParams, App, Activity, $sce) {
    var appName = $routeParams.name

    App.getReadme(appName).success(function (data) {
      $scope.readme = $sce.trustAsHtml(data)
    })

    App.get(appName).success(function (data) {
      $scope.app = data
    })

    Activity.launch(appName).success(function (data) {
      $scope.href = 'http://' + window.location.host + ':' + data.port
    })

    // pin app to boot
    $scope.update = function (bool) {
      $scope.app.bootOnLoad = bool
      App.update(appName, $scope.app).success(function () {
        toastr.success('App will start on load next time', 'Dashboard')
      })
    }
  }])

.controller('Apps#list', ['$scope', 'App', '$location',
  function ($scope, App, $location) {
    App.all().success(function (data) {
      $scope.apps = data
    })

    var dz = new Dropzone('#drawer', {
      url: '/apps',
      clickable: false,
      dictDefaultMessage: '',
      previewTemplate: $('.dz-template').html(),
      accept: function (file, done) {
        var fname = file.name
        var ext = [fname.split('.')[1], fname.split('.')[2]].join('.')
        if (ext === 'tar.gz' || ext === 'tgz.') {
          console.log('Uploading file with extension ' + ext)
          done()
        } else {
          done('Invalid file type. Must be a tar.gz')
          this.removeFile(file)
        }
      }
    })

    dz.on('success', function (file) {
      dz.removeFile(file)
      App.all().success(function (data) {
        $scope.apps = data
        $scope.$apply()
      })
    })

    dz.on('error', function (file, error, xhr) {
      toastr.error(error, 'Dashboard')
    })
  }])

.controller('Apps#edit', ['$scope', 'App', '$routeParams', '$sce',
  function ($scope, App, $routeParams, $sce) {
    var appName = $routeParams.name

    App.get(appName).success(function (data) {
      $scope.app = data
    })

    $.ajax('/apps/' + appName + '/package')
    .done(function (data) {
      $scope.package = $sce.trustAsHtml(data)
      $scope.$apply()
    })
    .fail(function (data) {
      toastr.error(data, 'Dashboard')
    })

    $scope.update = function () {
      var content = $('#content').text()
      App.update(appName, content).success(function (data) {
        toastr.success('Your app has been updated correctly', 'Dashboard')
      })
    }
  }])
