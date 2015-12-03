'use strict'
/* global angular */

angular.module('Dashboard')

.controller('Activities#list', ['$scope', 'Activity',
function ($scope, Activity) {
  Activity.all().success(function (data) {
    console.log(data)
    $scope.activities = data
    $scope._activities = data.filter(function (app) {
      return !app.netbeast || app.netbeast && app.netbeast.type !== 'service'
    })
  })
}])

.controller('Activities#live', ['$scope', '$routeParams', 'Activity', '$sce',
function ($scope, $routeParams, Activity, $sce) {
  Activity.open($routeParams.name)
  .success(function (data, status) {
    var aux = window.location.host
    aux = aux.substring(0, aux.indexOf(':'))
    aux = aux || window.location.host // recover if empty string
    $scope.url = 'http://' + aux + ':' + data.port
    $scope.href = $sce.trustAsResourceUrl($scope.url)
  })
}])
