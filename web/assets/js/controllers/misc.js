/* global angular */

angular.module('Dashboard')
.controller('Routes#index', ['$scope', '$http', function ($scope, $http) {
  $http.get('/routes')
  .success(function (data, status, headers, config) {
    $scope.routes = data
    $scope.keys = Object.keys
  })
  .error(function (data, status, headers, config) {
    console.log(status + ' when GET /routes -> ' + data)
  })
}])

angular.module('Dashboard')
.controller('Settings#index', ['$scope', '$http', function ($scope, $http) {
  $scope.update = function () {
    $http.put('/update')
  }
}])
