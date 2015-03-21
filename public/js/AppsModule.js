// Some helper methods:
//=====================

function setTitle(str) {
  document.title = 'Alfa | ' + str;
  var tooldiv = document.getElementById('title');
  tooldiv.innerHTML = '<span>' + str + '</span>';
  console.log('Changing name to ' + str);
};

// Apps Module
//==============

var AppsModule = angular.module('AppsModule', []);

AppsModule.controller('AppsListCtrl', ['$scope', '$http',
function ($scope, $http) {
  setTitle('Your apps drawer');
  var client = new API($http, 'apps');
  // DELETE
  $scope.API = client;
  // GET
  client.read($scope, '');
}]);

AppsModule.controller('AppsDetailCtrl', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {
    setTitle($routeParams.name);
    var client = new API($http, 'apps');
    client.read($scope, $routeParams.name);
}]);

AppsModule.controller('AppsActivitiesCtrl', ['$scope', '$routeParams',
function($scope, $routeParams) {
  //
}]);

AppsModule.controller('AppsNewCtrl', ['$scope', '$routeParams',
function($scope, $routeParams) {
  setTitle('Install a new app');
  var dz = new Dropzone(".dropzone", { url: "/apps"});
}]);
