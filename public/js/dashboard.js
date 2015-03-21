//
// Angular core of dashboard app
// by jesusdario, netbeast CTO
//==============================

var Dashboard = angular.module('Dashboard', ['ngRoute', 'AppsModule']);

Dashboard.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'views/apps/index.html',
    controller: 'AppsListCtrl'
  }).
  when('/apps/:name', {
    templateUrl: 'views/apps/show.html',
    controller: 'AppsDetailCtrl'
  }).
  when('/install', {
    templateUrl: 'views/apps/new.html',
    controller: 'AppsNewCtrl'
  }).
  when('/remove', {
    templateUrl: 'views/apps/delete.html',
    controller: 'AppsRmCtrl'
  }).
  when('/activities', {
    templateUrl: 'views/apps/activities.html',
    controller: 'AppsActivitiesCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
