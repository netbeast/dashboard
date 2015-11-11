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

.controller('Activities#live', ['$scope', '$routeParams', 'Activity',
function ($scope, $routeParams, Activity) {
  Activity.open($scope, $routeParams.name)
}])
