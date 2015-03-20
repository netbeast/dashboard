var AppsModule = angular.module('AppsModule', []);

AppsModule.controller('AppsListCtrl', ['$scope', '$http',
function ($scope, $http) {

  var client = new API($http);

  // DELETE
  $scope.delete = client.delete;

  // GET
  client.read($scope, '');

}]);

AppsModule.controller('AppsDetailCtrl', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {

    var client = new API($http);
    client.read($scope, $routeParams.name)
}]);

AppsModule.controller('AppsActivitiesCtrl', ['$scope', '$routeParams',
function($scope, $routeParams) {
  //
}]);

AppsModule.controller('AppsNewCtrl', ['$scope', '$routeParams',
function($scope, $routeParams) {
  //
}]);
