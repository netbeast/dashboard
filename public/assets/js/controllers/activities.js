'use strict'

var helper = require('../helpers')

angular.module('Dashboard')

.controller('ActivitiesListCtrl', [
	'$scope', 'Activities',
	function($scope, Activities) {
		helper.setTitle('Apps running')
		helper.setNavColor('yellow')
		Activities.all()
		.success(function(data) {
			$scope.apps = data
		})
		$scope.stop = Activities.stop
	}])

.controller('ActivitiesLiveCtrl', [
	'$scope', '$routeParams', 'Activities',
	function ($scope, $routeParams, Activities) {
		helper.setTitle($routeParams.name)
		helper.setNavColor('green')
		Activities.open($scope, $routeParams.name)
	}])