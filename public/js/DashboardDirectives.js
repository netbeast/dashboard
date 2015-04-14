(function() {

	var Dashboard = angular.module('Dashboard');

	Dashboard.directive('toolBox', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/tool-box.html'
		};
	});

	Dashboard.directive('appRmBtn', ['$http',
		function($http) {
			return {
				restrict: 'E',
				scope: {
					app: '=app'
				},
				template: '<div class="del-overlay">'
				+ '<a class="btn danger" ng-click="delete()">'
				+ 'Delete </a></div>',
				controller: function($scope, $element) {
					$scope.delete = function() {
						new AppsClient($http)
						.delete($scope.app.name)
					};
				}
			};
		}]);

})();