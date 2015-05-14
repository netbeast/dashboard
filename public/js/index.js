//
// Angular core of dashboard app
// by jesus@netbeast
//==============================
(function(){
  var Dashboard = angular.module('Dashboard', ['ngRoute', 'toastr']);

  Dashboard.controller('RoutesCtrl', ['$scope', '$http',
    function ($scope, $http) {
      setTitle('[Dev] API');
      setNavColor('orange');
      $http.get('/routes').
      success(function(data, status, headers, config) {
        console.log('GET /routes -> ' + data);
        $scope.routes = data;
        $scope.keys = Object.keys;
      }).
      error(function(data, status, headers, config) {
        console.log(status + ' when GET /routes -> ' + data);
      });
    }]);

  Dashboard.run([ 'toastr', function(toastr) {
    // Error handling
    ws = io.connect('/');
    ws.on('hello', function () {
      console.log('ws/main: server fetched.');
    });
    ws.on('success', function (msg) {
      toastr.success(msg, 'Dashboard');
      console.log('ws/main: server fetched.');
    });
    ws.on('stdout', function (stdout) {
      toastr.info(stdout, 'Dashboard');
      console.log('ws/stdout: %s', stdout);
    });
    ws.on('stderr', function (stderr) {
      toastr.error(stderr, 'Dashboard');
      console.log('ws/stderr: %s', stderr);
    });

    _gaq.push(['_trackEvent', 'dashboard', 'welcome']);

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
        controller: 'AppsDetailCtrl'
      }).
      when('/install/', {
        templateUrl: 'views/apps/new.html',
        controller: 'AppsNewCtrl'
      }).
      when('/install/:method', {
        templateUrl: 'views/apps/new.html',
        controller: 'AppsNewCtrl'
      }).
      when('/i/:name', {
        templateUrl: 'views/apps/live.html',
        controller: 'AppsLiveCtrl'
      }).
      when('/remove', {
        templateUrl: 'views/apps/delete.html',
        controller: 'AppsRmCtrl'
      }).
      when('/activities', {
        templateUrl: 'views/apps/activities.html',
        controller: 'ActivitiesCtrl'
      }).
      when('/signin', {
        templateUrl: 'views/users/signin.html',
        controller: 'LoginCtrl'
      }).
      when('/routes', {
        templateUrl: 'views/routes.html',
        controller: 'RoutesCtrl'
      }).
      when('/settings', {
        templateUrl: 'views/users/signin.html',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    }]);
})();