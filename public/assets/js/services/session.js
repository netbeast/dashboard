/* global angular, toastr */

var store = require('store')
var _hashPasswords = require('../helpers')._hashPasswords

angular.module('Dashboard')
.factory('Session', ['$http', '$rootScope', '$location',
function SessionFactory ($http, $rootScope, $location) {
  var self = {}
  self.save = function (data) {
    console.log('Saving session...')
    $rootScope.user = data
    store.set('user', data)
    console.log(data)
  }

  self.login = function (credentials) {
    console.log('login %s', credentials.toString())
    var creds = _hashPasswords(credentials)
    $http.post('/login', creds).success(function (data) {
      $location.path('/')
      toastr.success('Welcome ' + data.alias)
      self.save(data)
    })
  }

  self.update = function () {
    console.log('Retrieving session...')
    $http.get('/sessions').success(function (data) {
      self.save(data)
    })
  }

  self.load = self.getCurrentUser = function () {
    var user = store.get('user')
    console.log('Stored user is:')
    console.log(user)
    return user
  }

  self.logout = function () {
    $http.get('/logout').then(function () {
      store.remove('user')
      delete $rootScope.user
      toastr.success('See you soon :)')
      $location.path('/')
    })
  }

  self.update()

  return self
}])
