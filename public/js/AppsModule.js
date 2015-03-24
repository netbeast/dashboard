// Apps Module
//==============

var AppsModule = angular.module('AppsModule', []);

AppsModule.controller('AppsListCtrl', ['$scope', '$http',
function ($scope, $http) {
  setTitle('Your apps drawer');
  setNavColor('blue');
  var client = new AppsClient($http);
  client.read($scope, '');
}]);

AppsModule.controller('AppsRmCtrl', ['$scope', '$http',
function ($scope, $http) {
  setTitle('Uninstall apps');
  setNavColor('red');
  var client = new AppsClient($http);
  $scope.AppsClient = client;
  client.read($scope, '');
}]);

AppsModule.controller('AppsDetailCtrl', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {
  setNavColor('green');
  setTitle($routeParams.name);
  var launcher = new ActivitiesClient($http);
  var client = new AppsClient($http);
  client.read($scope, $routeParams.name);
  launcher.read($scope, $routeParams.name);
}]);

AppsModule.controller('AppsActivitiesCtrl', ['$scope', '$http',
function($scope, $http) {
  setTitle('Apps running');
  setNavColor('yellow');
  var launcher = new ActivitiesClient($http);
  $scope.ActivitiesClient = launcher;
  launcher.read($scope, '');
}]);

AppsModule.controller('AppsNewCtrl', ['$scope',
function($scope) {

  hideNav();
  setTitle('Install a new app');

  var dz = new Dropzone(".dropzone", {
    url: "/apps",
    maxFiles: 1,
    accept: function(file, done) {
      var fname = file.name;
      var ext = [fname.split('.')[1], fname.split('.')[2]].join('.');
      if(ext === 'tar.gz' || ext === 'tgz.' || ext === 'zip.') {
        console.log('Uploading file with extension ' + ext);
        done();
      } else {
        done('Invalid file type. Must be a zip or tar.gz');
        this.removeFile(file);
      }
    }
  });

  dz.on("error", function(file, error, xhr) {
    alert(error);
    dz.removeFile(file);
  });

  dz.on("success", function(file, response) {
    window.location.assign("/");
  });

  dz.on("uploadprogress", function(file) {
    ;
  });

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
