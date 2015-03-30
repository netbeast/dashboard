// Apps Module
//==============
(function() {
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
      setNavColor('blue');
      setTitle($routeParams.name);
      var launcher = new ActivitiesClient($http);
      var client = new AppsClient($http);
      client.read($scope, $routeParams.name);
      launcher.launch($scope, $routeParams.name);
      $scope.launcher = launcher;
    }]);

  AppsModule.controller('ActivitiesCtrl', ['$scope', '$http',
    function($scope, $http) {
      setTitle('Apps running');
      setNavColor('yellow');
      var launcher = new ActivitiesClient($http);
      $scope.ActivitiesClient = launcher;
      launcher.read($scope);
    }]);

  AppsModule.controller('AppsNewCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams) {

      hideNav();
      setTitle('Install a new app');

      switch($routeParams.method) {
        case 'package':
          $scope.tab = 1;
          break;
        case 'github':
          $scope.tab = 2;
          break;
        case 'docker':
          $scope.tab = 3;
          break;
        default:
          $scope.tab = 1;
      }

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

    }]);
})();