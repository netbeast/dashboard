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
				+ '<a class="btn btn-danger" ng-click="delete()">'
				+ 'Delete </a></div>',
				controller: function($scope, $element) {
					$scope.delete = function () {
						var item = $scope.app.name;
						var msg = 'Are you sure you want to uninstall ' + item + '?';
						if (confirm(msg)) {
							$http.delete('/apps/' + item).
							success(function(data, status, headers, config) {
								console.log('DELETE  /apps/' + item + ' -> ' + data);
								itemHTML = document.getElementById(item);
								itemHTML.parentElement.removeChild(itemHTML);
							}).
							error(function(data, status, headers, config) {
								console.log(status + ' when DELETE /apps/'+item+' -> ' + data);
							});
						}
					};
				}
			};
		}]);

})();