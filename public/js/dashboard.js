//
// Angular core of dashboard app
// by jesusdario, netbeast CTO
//==============================

var dashboard = angular.module('dashboard', ['ngRoute']);

dashboard.controller('AppsController', function($scope) {
  $scope.apps = [
    { name: 'sample1', author: 'drm' },
    { name: 'sample2', author: 'drm' },
    { name: 'sample3', author: 'drm' },
    { name: 'sample4', author: 'drm' }
  ];
});

dashboard.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/apps/index.html',
        controller: 'AppsController'
      }).
      when('/apps', {
        templateUrl: 'views/apps/index.html',
        controller: 'AppsController'
      }).
      when('/apps/:name', {
        templateUrl: 'views/apps/show.html',
        controller: 'AppsController'
      }).
      when('/install', {
        templateUrl: 'views/apps/new.html',
        controller: 'AppsController'
      }).
      when('/activities', {
        templateUrl: 'views/apps/on.html',
        controller: 'AppsController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
