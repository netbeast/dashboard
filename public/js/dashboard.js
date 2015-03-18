//
// Angular core of dashboard app
// by jesusdario, netbeast CTO
//==============================

var dashboard = angular.module('dashboard', ['ngRoute']);

dashboard.controller('AppsController', function($scope, $http) {
  // Simple GET request example : https://docs.angularjs.org/api/ng/service/$http
  $http.get('/apps').
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.apps = data;
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    /* SHOW ERROR TEMPLATE */
  });
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
