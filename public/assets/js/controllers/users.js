'use strict'

var helper = require('../helper')

angular.module('Dashboard')
.controller('LoginCtrl', ['$scope', '$http', '$location', '$rootScope', 
	function ($scope, $http, $location, $rootScope) {
		helper.setTitle('Sign in')
		$scope.credentials = {}
		$scope.login = function (credentials) {
			$http.post('/login', credentials)
			.success(function(data, status, headers, config) {
				console.log('POST  /login -> ')
				console.log(data)
				$rootScope.user = data           
				$location.path("/")
			})
			.error(function(data, status, headers, config) {
				toastr.error(data)
			})
		}
	}])