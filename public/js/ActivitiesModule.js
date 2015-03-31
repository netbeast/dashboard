(function() {
	angular.module('Dashboard').
	controller('ActivitiesCtrl', ['$scope', '$http',
		function($scope, $http) {
			setTitle('Apps running');
			setNavColor('yellow');
			var launcher = new ActivitiesClient($http);
			$scope.ActivitiesClient = launcher;
			launcher.read($scope);
		}]);
})();