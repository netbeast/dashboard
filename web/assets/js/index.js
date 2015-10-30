/* global angular */
// Angular core of dashboard app
// by jesus@netbeast
// =============================

var mqtt = require('mqtt')
var broker = require('./helpers/broker')

const V = '/views/'

angular.module('Dashboard', ['ngRoute', 'angular-loading-bar'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', { templateUrl: V + 'apps/index.html', controller: 'Apps#list' })
  .when('/apps/:name', { templateUrl: V + 'apps/show.html', controller: 'Apps#show' })
  .when('/apps/:name/edit', { templateUrl: V + 'apps/edit.html', controller: 'Apps#edit' })
  .when('/i/:name', {templateUrl: V + 'apps/live.html', controller: 'Activities#live'})
  .when('/activities', { templateUrl: V + 'apps/activities.html', controller: 'Activities#list' })
  .when('/login', { templateUrl: V + 'users/login.html', controller: 'Users#login' })
  .when('/signup', { templateUrl: V + 'users/signup.html', controller: 'Users#signup' })
  .when('/routes', { templateUrl: V + 'misc/routes.html', controller: 'Routes#index' })
  .when('/settings', { templateUrl: V + 'misc/settings.html', controller: 'Settings#index' })
  .otherwise({ redirectTo: '/' })
}])

.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false
}])

.run(function () {
  var ws = mqtt.connect('ws://localhost:1883')
  ws.subscribe('notifications')
  ws.on('message', broker.handle)
})

require('./services')
require('./directives')
require('./controllers')
