// Apps Module
//==============

var AppsModule = angular.module('AppsModule', []);

AppsModule.controller('AppsListCtrl', ['$scope', '$http',
function ($scope, $http) {
  setTitle('Your apps drawer');
  setNavColor('blue');
  var client = new API($http, 'apps');
  client.read($scope, '');
}]);

AppsModule.controller('AppsRmCtrl', ['$scope', '$http',
function ($scope, $http) {
  setTitle('Uninstall apps');
  setNavColor('red');
  var client = new API($http, 'apps');
  $scope.API = client;
  client.read($scope, '');
}]);

AppsModule.controller('AppsDetailCtrl', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {
  setTitle($routeParams.name);
  var client = new API($http, 'apps');
  client.read($scope, $routeParams.name);
}]);

AppsModule.controller('AppsActivitiesCtrl', ['$scope',
function($scope) {
  setTitle('Apps running');
  setNavColor('yellow');
}]);

AppsModule.controller('AppsNewCtrl', ['$scope',
function($scope) {

  var dz = new Dropzone(".dropzone", { url: "/apps"});
  setTitle('Install a new app');
  hideNav();

  $scope.tabs = ['Package', 'GitHub', 'Docker'];

  $scope.onClickTab = function (tab) {
    tab = tab.toLowerCase();
    $scope.tabs.forEach(function(t) {
      t = t.toLowerCase();
      if (t === tab) {
        t = document.getElementById(t);
        t.style.display = 'block';
      } else {
        t = document.getElementById(t);
        t.style.display = 'none';
      }
    });
  }
}]);
