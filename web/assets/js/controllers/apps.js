/* global angular, toastr,  $ */
'use strict'

var helper = require('../helpers')
var Dropzone = require('Dropzone')

angular.module('Dashboard')

.controller('Apps#show', ['$scope', '$routeParams', 'Apps', 'Activities', '$sce',
  function ($scope, $routeParams, Apps, Activities, $sce) {
    var appName = $routeParams.name
    helper.setNavColor('blue')
    helper.setTitle(appName)

    Apps.getReadme(appName).success(function (data) {
      $scope.readme = $sce.trustAsHtml(data)
    })

    Apps.get(appName).success(function (data) {
      $scope.app = data
    })

    Activities.launch(appName).success(function (data) {
      $scope.href = 'http://' + window.location.host + ':' + data.port
    })

    // pin app to boot
    $scope.update = function (bool) {
      $scope.app.bootOnLoad = bool
      Apps.update(appName, $scope.app).success(function () {
        toastr.success('App will start on load next time', 'Dashboard')
      })
    }
  }])

.controller('Apps#list', ['$scope', 'Apps', '$location',
  function ($scope, Apps, $location) {
    helper.setTitle('Your apps drawer')
    helper.setNavColor('blue')

    Apps.all().success(function (data) {
      $scope.apps = data
    })

    var dz = new Dropzone('.drawer', {
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
      Apps.all().success(function (data) {
        $scope.apps = data
        $scope.$apply()
      })
    })

    dz.on('error', function (file, error, xhr) {
      toastr.error(error, 'Dashboard')
    })
  }])

.controller('Apps#edit', ['$scope', 'Apps', '$routeParams', '$sce',
  function ($scope, Apps, $routeParams, $sce) {
    var appName = $routeParams.name

    Apps.get(appName).success(function (data) {
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
      Apps.update(appName, content).success(function (data) {
        toastr.success('Your app has been updated correctly', 'Dashboard')
      })
    }
  }])
