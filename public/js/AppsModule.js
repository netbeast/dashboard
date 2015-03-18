var AppsModule = angular.module('AppsModule', []);

AppsModule.controller('AppsListCtrl', ['$scope', '$http',
function ($scope, $http) {

  API.HTTP =  $http;

  // DELETE
  $scope.delete = API.delete;

  // GET
  API.read($scope, '');

}]);

AppsModule.controller('AppsDetailCtrl', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {
  API.HTTP =  $http;
  API.read($scope, $routeParams.name)
}]);

AppsModule.controller('AppsActivitiesCtrl', ['$scope', '$routeParams',
function($scope, $routeParams) {
  //
}]);

AppsModule.controller('AppsNewCtrl', ['$scope', '$routeParams',
function($scope, $routeParams) {
  //
}]);
