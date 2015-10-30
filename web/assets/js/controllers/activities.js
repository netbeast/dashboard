'use strict'
/* global angular */

angular.module('Dashboard')

.controller('Activities#list', ['$scope', 'Activity',
function ($scope, Activity) {
  Activity.all().success(function (data) {
    $scope.activities = data
  })
}])

.controller('Activities#live', ['$scope', '$routeParams', 'Activity',
function ($scope, $routeParams, Activity) {
  Activity.open($scope, $routeParams.name)
}])
