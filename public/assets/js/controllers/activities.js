'use strict';

var helper = require('../helper');

require('angular').module('Dashboard').
controller('ActivitiesListCtrl', ['$scope', 'toastr', 'Activities',
	function($scope, toastr, Activities) {
		helper.setTitle('Apps running');
		helper.setNavColor('yellow');
		Activities.all()
		.success(function(data) {
			$scope.apps = data;
		}).
		error(function(data, status) {
			toastr.error(data, 'Status ' + status);
		});
		$scope.stop = Activities.stop;
	}])
.controller('ActivitiesLiveCtrl', ['$scope', '$routeParams', 'Activities',
  function ($scope, $routeParams, Activities) {
    helper.setTitle($routeParams.name);
    helper.setNavColor('green');
    Activities.open($scope, $routeParams.name);
  }]);