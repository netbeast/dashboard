/* global angular */

var store = require('store')

angular.module('Netbeast')
.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      var user = store.get('user')
      if (!user) return config

      var token = user.token
      config.headers['Authorization'] = token
      return config
    }
  }
})

.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor')
}])
