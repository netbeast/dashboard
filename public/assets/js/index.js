//
// Angular core of dashboard app
// by jesus@netbeast
//==============================

var mqtt = require('mqtt')
, broker = require('./helpers/broker')

angular.module('Dashboard', ['ngRoute'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/apps/index.html',
      controller: 'AppsListCtrl'
    })
    .when('/apps/:name', {
      templateUrl: 'views/apps/show.html',
      controller: 'AppsShowCtrl'
    })
    .when('/install/', {
      templateUrl: 'views/apps/new.html',
      controller: 'AppsNewCtrl'
    })
    .when('/i/:name', {
      templateUrl: 'views/apps/live.html',
      controller: 'ActivitiesLiveCtrl'
    })
    .when('/remove', {
      templateUrl: 'views/apps/delete.html',
      controller: 'AppsRmCtrl'
    })
    .when('/activities', {
      templateUrl: 'views/apps/activities.html',
      controller: 'ActivitiesListCtrl'
    })
    .when('/signin', {
      templateUrl: 'views/users/signin.html',
      controller: 'LoginCtrl'
    })
    .when('/routes', {
      templateUrl: 'views/misc/routes.html',
      controller: 'RoutesCtrl'
    })
    .when('/settings', {
      templateUrl: 'views/misc/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    })
  }])

.run(function () {
  var ws = mqtt.connect('ws://localhost:1883')
  ws.subscribe('notifications')
  ws.on('message', broker.handle)
})

require('./services')
require('./directives')
require('./controllers')
