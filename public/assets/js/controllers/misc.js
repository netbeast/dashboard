'use strict';

var helper = require('../helper')

require('angular').module('Dashboard')
.controller('RoutesCtrl', ['$scope', '$http',
  function ($scope, $http) {
    helper.setTitle('[Dev] API');
    helper.setNavColor('orange');
    $http.get('/routes').
    success(function(data, status, headers, config) {
      $scope.routes = data;
      $scope.keys = Object.keys;
    }).
    error(function(data, status, headers, config) {
      console.log(status + ' when GET /routes -> ' + data);
    });
  }]);

require('angular').module('Dashboard')
.controller('SettingsCtrl', ['$scope', '$http',
  function ($scope, $http) {
    helper.setTitle('Settings');
    helper.setNavColor('#777777');
  }]);