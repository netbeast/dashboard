'use strict';

var helper = require('../helper');

require('angular').module('Dashboard').
controller('ActivitiesCtrl', ['$scope', '$http',
	function($scope, $http) {
		helper.setTitle('Apps running');
		helper.setNavColor('yellow');
		var launcher = new ActivitiesClient($http);
		$scope.ActivitiesClient = launcher;
		launcher.read($scope);
	}]);
