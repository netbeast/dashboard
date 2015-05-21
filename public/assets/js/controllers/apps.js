'use strict';

var helper = require('../helper');
var app = require('angular').module('Dashboard');
var Dropzone = require('Dropzone');

app.controller('AppsListCtrl', ['$scope', '$http', 'toastr',
  function ($scope, $http, toastr) {
    helper.setTitle('Your apps drawer');
    helper.setNavColor('blue');
    $http.get('/apps').
    success(function(data, status, headers, config) {
      $scope.apps = data.apps;
      if(!data.user) {
        $('#myModal').modal();
      }
    }).
    error(function(data, status, headers, config) {
      toastr.error(data)
    });
  }]);

app.controller('AppsRmCtrl', ['$scope', '$http',
  function ($scope, $http) {
    helper.setTitle('Uninstall apps');
    helper.setNavColor('red');
    $http.get('/apps').
    success(function(data, status, headers, config) {
      console.log('GET /apps -> ' + data);
      $scope.apps = data.apps;
    }).
    error(function(data, status, headers, config) {
      console.log(status + ' when GET /apps -> ' + data);
    });
  }]);

app.controller('AppsDetailCtrl', ['$scope', '$routeParams', '$http', 'toastr',
  function($scope, $routeParams, $http, toastr) {
    helper.setNavColor('blue');
    helper.setTitle($routeParams.name);
      // GET app details
      $http.get('/apps/' + $routeParams.name).
      success(function(data, status, headers, config) {
        console.log('GET /apps/' + $routeParams.name + '/ ->' + data);
        $scope.app = data;
      }).
      error(function(data, status, headers, config) {
        console.error(data);
      });
      // PUT app running
      var launcher = new ActivitiesClient($http, toastr);
      launcher.launch($scope, $routeParams.name);
      $scope.launcher = launcher;
    }]);

app.controller('AppsLiveCtrl', ['$scope', '$http', '$routeParams', '$sce',
  function ($scope, $http, $routeParams, $sce) {
    var item = $routeParams.name;
    helper.setTitle(item);
    helper.setNavColor('green');
    $http.get('/apps/' + item + '/port').
    success(function(data, status, headers, config) {
      if (data) {
        console.log('GET /apps/' + item + '/port ->' + data);
        $scope.url = 'http://' + window.location.host + ':' + data;
        iframe = document.getElementById('live');
        $scope.go = function(towards) {
          console.log('go %s', towards);
          iframe.contentWindow.history.go(towards);
        };
        $scope.href = $sce.trustAsResourceUrl($scope.url);
      } else {
        window.location.assign("/");
      }
    }).
    error(function(data, status, headers, config) {
      console.error(data);
      window.location.assign("/");
    });
  }]);

app.controller('AppsNewCtrl', ['$scope', '$routeParams', '$http', 'toastr', '$location',
  function($scope, $routeParams, $http, toastr, $location) {

    helper.hideNav();
    helper.setTitle('Install a new app');

    var dz = new Dropzone(".dropzone", {
      url: "/apps",
      maxFiles: 1,
      accept: function(file, done) {
        var fname = file.name;
        var ext = [fname.split('.')[1], fname.split('.')[2]].join('.');
        if(ext === 'tar.gz' || ext === 'tgz.') {
          console.log('Uploading file with extension ' + ext);
          done();
        } else {
          done('Invalid file type. Must be a tar.gz');
          this.removeFile(file);
        }
      }
    });

    dz.on("error", function(file, error, xhr) {
      toastr.error(error);
      dz.removeFile(file);
    });

    dz.on("success", function(file, response) {
      $location.path("/");
    });
  }]);