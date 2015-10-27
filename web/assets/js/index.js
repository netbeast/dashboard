/* global angular */
// Angular core of dashboard app
// by jesus@netbeast
// =============================

var mqtt = require('mqtt')
var broker = require('./helpers/broker')

const V = '/views/'

angular.module('Dashboard', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', { templateUrl: V + 'apps/index.html', controller: 'Apps#list' })
  .when('/apps/:name', { templateUrl: V + 'apps/show.html', controller: 'Apps#show' })
  .when('/apps/:name/edit', { templateUrl: V + 'apps/edit.html', controller: 'Apps#edit' })
  .when('/i/:name', {templateUrl: V + 'apps/live.html', controller: 'Activities#live'})
  .when('/remove', { templateUrl: V + 'apps/delete.html', controller: 'Apps#rm' })
  .when('/activities', { templateUrl: V + 'apps/activities.html', controller: 'Activities#list' })
  .when('/signin', { templateUrl: V + 'users/signin.html', controller: 'User#login' })
  .when('/routes', { templateUrl: V + 'misc/routes.html', controller: 'Routes#index' })
  .when('/settings', { templateUrl: V + 'misc/settings.html', controller: 'Settings#index' })
  .otherwise({ redirectTo: '/' })
}])

.run(function () {
  var ws = mqtt.connect('ws://localhost:1883')
  ws.subscribe('notifications')
  ws.on('message', broker.handle)
})

require('./services')
require('./directives')
require('./controllers')
