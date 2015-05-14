// Apps Module
//==============
(function() {

	angular.module('Dashboard')
	.controller('LoginCtrl', ['$scope', '$http', '$location', '$rootScope', 'toastr',
		function ($scope, $http, $location, $rootScope, toastr) {
			setTitle('Sign in');
			$('#myModal').modal('hide');
			$scope.credentials = {
				email: '',
				password: ''
			};
			$scope.login = function (credentials) {
				var creds = {
					email: credentials.email,
					password: credentials.password
				}
				$http.post('/login', creds).
				success(function(data, status, headers, config) {
					console.log('POST  /login -> ');
					console.log(data);
					$rootScope.user = creds;           
					$location.path("/");
				}).
				error(function(data, status, headers, config) {
					toastr.error(data);
				});
				console.log("hello");
			};
		}])

})();