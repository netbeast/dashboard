/* global angular, toastr */

'use strict'

var _validateUserForm = require('../helpers')._validateUserForm
var _hashPasswords = require('../helpers')._hashPasswords

angular.module('Dashboard')
.factory('User', ['$http', '$location', 'Session', '$rootScope',
function ActivitiesFactory ($http, $location, Session, $rootScope) {
  var self = {}
  
  self.get = function (alias) {
    return $http.get('/users/' + alias)
  }

  self.all = function () {
    return self.get('')
  }

  self.signup = function (userForm) {
    if (!_validateUserForm(userForm)) {
      return false
    } else {
      var user = _hashPasswords(userForm)
      return $http.post('/signup', user)
      .success(function (data, status, headers, config) {
        toastr.success('An activation code has been sent to ' + data.email)
      })
    }
  }

  self.update = function (userForm) {
    if (!_validateUserForm(userForm)) {
      return false
    } else {
      var user = _hashPasswords(userForm)
      user._id = Session.load()._id
      return $http.put('/users', user)
      .success(function (data, status, headers, config) {
        console.log('PUT  /users/ -> ')
        console.log(userForm)
        toastr.success('Your data has been successfully updated')
        Session.save(user)
      })
    }
  }

  self.remove = function () {
    if (window.confirm('Are you sure you want to delete your account?')) {
      $http.delete('/users')
      .success(function (data, status, headers, config) {
        toastr.success('Sorry to see you go :[')
        Session.logout()
        return $location.path('/')
      })
    }
  }

  self.getCurrentUser = function () {
    return $rootScope.user
  }

  self.authenticate = function () {
    if (!self.getCurrentUser()) {
      console.log('User not logged in. Redirecting...')
      $location.path('/login')
    }
  }

  self.redirectIfLogged = function () {
    if (self.getCurrentUser()) {
      console.log('User is already logged. Redirecting...')
      return $location.path('/apps')
    }
  }

  return self
}])
