/* global angular */

var md5 = require('md5')
var _chunk = require('lodash/array/chunk')

angular.module('Dashboard')

.controller('Users#index', ['$scope', 'User',
function ($scope, User) {
  User.all().success(function (data) {
    data.forEach(function (user) {
      user.gravatar = md5(user.email)
    })
    $scope.users = data
  })
}])

.controller('Users#login', ['$scope', 'User', 'Session',
function ($scope, User, Session) {
  $scope.user = {}
  User.redirectIfLogged()
  $scope.login = Session.login
}])

.controller('Users#signup', ['$scope', 'User',
function ($scope, User) {
  $scope.user = {}
  User.redirectIfLogged()
  $scope.signup = User.signup
}])

.controller('Users#settings', ['$scope', 'User', 'Session',
function ($scope, User, Session) {
  User.authenticate()
  $scope.currentUser = Session.getCurrentUser()
  $scope.currentUser.gravatar = md5($scope.currentUser.email)
  $scope.update = User.update
  $scope.delete = User.remove
}])

.controller('InvitationCtrl', ['User', function (User) {
  User.redirectIfLogged()
}])

.controller('Users#show', ['$scope', '$routeParams', 'User', 'Apps',
function ($scope, $routeParams, User, Apps) {
  User.get($routeParams.name).success(function (data) {
    $scope.u = data
    $scope.u.gravatar = md5(data.email)
    Apps.from($routeParams.name).success(function (data) {
      $scope.cols = _chunk(data, Math.ceil(data.length / 4))
    })
  })
}])
