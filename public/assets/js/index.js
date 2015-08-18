//
// Angular core of dashboard app
// by jesus@netbeast
//==============================

$ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var angular = require('angular');
require('angular-route');
require('angular-toastr');
require('angular-contextmenu');
var io = require('./lib/socket.io');

var Dashboard = angular.module('Dashboard', ['ngRoute', 'toastr', 'io.dennis.contextmenu']);

Dashboard.run(['toastr', function(toastr) {
    // Error handling
    ws = io.connect('/');
    ws.on('hello', function () {
      console.log('ws/main: server fetched.');
    });
    ws.on('success', function (msg) {
      toastr.success(msg, 'xway');
      console.log('ws/main: server fetched.');
    });
    ws.on('warning', function (msg) {
      toastr.warning(msg, 'xway');
      console.log('ws/stderr: %s', stderr);
    });
    ws.on('stdout', function (stdout) {
      toastr.info(stdout, 'xway');
      console.log('ws/stdout: %s', stdout);
    });
    ws.on('stderr', function (stderr) {
      toastr.error(stderr, 'xway');
      console.log('ws/stderr: %s', stderr);
    });
  }]);

Dashboard.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'views/apps/index.html',
      controller: 'AppsListCtrl'
    }).
    when('/apps/:name', {
      templateUrl: 'views/apps/show.html',
      controller: 'AppsShowCtrl'
    }).
    when('/install/', {
      templateUrl: 'views/apps/new.html',
      controller: 'AppsNewCtrl'
    }).
    when('/i/:name', {
      templateUrl: 'views/apps/live.html',
      controller: 'ActivitiesLiveCtrl'
    }).
    when('/remove', {
      templateUrl: 'views/apps/delete.html',
      controller: 'AppsRmCtrl'
    }).
    when('/activities', {
      templateUrl: 'views/apps/activities.html',
      controller: 'ActivitiesListCtrl'
    }).
    when('/signin', {
      templateUrl: 'views/users/signin.html',
      controller: 'LoginCtrl'
    }).
    when('/routes', {
      templateUrl: 'views/misc/routes.html',
      controller: 'RoutesCtrl'
    }).
    when('/settings', {
      templateUrl: 'views/misc/settings.html',
      controller: 'SettingsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);

require('./services');
require('./directives');
require('./controllers');
