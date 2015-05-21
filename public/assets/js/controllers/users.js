'use strict';

var helper = require('../helper');

require('angular').module('Dashboard')
.controller('LoginCtrl', ['$scope', '$http', '$location', '$rootScope', 'toastr',
	function ($scope, $http, $location, $rootScope, toastr) {
		helper.setTitle('Sign in');
		$('#myModal').modal('hide');
		$scope.credentials = {
			email: '',
			password: ''
		};
		$scope.login = function (credentials) {
			$http.post('/login', credentials).
			success(function(data, status, headers, config) {
				console.log('POST  /login -> ');
				console.log(data);
				$rootScope.user = data;           
				$location.path("/");
			}).
			error(function(data, status, headers, config) {
				toastr.error(data);
			});
		};
	}]);