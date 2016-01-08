'use strict'
/* global angular */

angular.module('Dashboard')

.controller('Activities#list', ['$scope', 'Activity',
function ($scope, Activity) {
  Activity.all().success(function (data) {
    console.log(data)
    $scope.activities = data
  })
}])

.controller('Activities#live', ['$scope', '$routeParams', 'Activity', '$sce',
function ($scope, $routeParams, Activity, $sce) {
  Activity.open($routeParams.name)
  .success(function (data, status) {
    var aux = window.location.host
    // aux = aux.substring(0, aux.indexOf(':'))
    aux = aux || window.location.host // recover if empty string
    // $scope.url = 'http://' + aux + ':' + data.port
    $scope.url = '/i/' + $routeParams.name
    $scope.href = $sce.trustAsResourceUrl($scope.url)
  })
}])
