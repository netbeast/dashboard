/* global angular */
// Angular core of dashboard app
// by jesus@netbeast
// =============================

const V = '/views/'

angular.module('Dashboard', ['ngRoute', 'angular-loading-bar', 'cfp.loadingBar'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', { templateUrl: V + 'apps/index.html', controller: 'Apps#list' })
  .when('/apps/:name', { templateUrl: V + 'apps/show.html', controller: 'Apps#show' })
  .when('/apps/:name/edit', { templateUrl: V + 'apps/edit.html', controller: 'Apps#edit' })
  .when('/i/:name', {templateUrl: V + 'apps/live.html', controller: 'Activities#live'})
  .when('/activities', { templateUrl: V + 'apps/index.html', controller: 'Activities#list' })
  .when('/uninstall', { templateUrl: V + 'apps/index.html', controller: 'Apps#rm' })
  .when('/install', { templateUrl: V + 'apps/install.html', controller: 'Apps#install' })
  .when('/login', { templateUrl: V + 'users/login.html', controller: 'Users#login' })
  .when('/signup', { templateUrl: V + 'users/signup.html', controller: 'Users#signup' })
  .when('/routes', { templateUrl: V + 'misc/routes.html', controller: 'Routes#index' })
  .when('/settings', { templateUrl: V + 'misc/settings.html', controller: 'Settings#index' })
  .otherwise({ redirectTo: '/' })
}])

.run(['Session', function (Session) {
  Session.update()
}])

.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false
}])

require('./broker')
require('./services')
require('./directives')
require('./controllers')
