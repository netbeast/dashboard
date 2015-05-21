'use strict';

var helper = require('../helper');

require('angular').module('Dashboard').
controller('ActivitiesCtrl', ['$scope', 'toastr', 'Activities',
	function($scope, toastr, Activities) {
		helper.setTitle('Apps running');
		helper.setNavColor('yellow');
		//$scope.ActivitiesClient = launcher;
		Activities.all()
		.success(function(data) {
			$scope.apps = data;
		}).
		error(function(data, status) {
			toastr.error(data, 'Status ' + status);
		});
		$scope.stop = Activities.stop;
	}]);
