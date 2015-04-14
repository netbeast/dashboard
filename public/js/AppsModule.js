// Apps Module
//==============
(function() {

  var app = angular.module('Dashboard');

  app.controller('AppsListCtrl', ['$scope', '$http',
    function ($scope, $http, toastr) {
      setTitle('Your apps drawer');
      setNavColor('blue');
      var client = new AppsClient($http);
      client.read($scope, '');
    }]);

  app.controller('AppsRmCtrl', ['$scope', '$http',
    function ($scope, $http) {
      setTitle('Uninstall apps');
      setNavColor('red');
      var client = new AppsClient($http);
      $scope.AppsClient = client;
      client.read($scope, '');
    }]);

  app.controller('AppsDetailCtrl', ['$scope', '$routeParams', '$http', 'toastr',
    function($scope, $routeParams, $http, toastr) {
      setNavColor('blue');
      setTitle($routeParams.name);
      // GET app details
      var client = new AppsClient($http);
      client.read($scope, $routeParams.name);
      // PUT app running
      var launcher = new ActivitiesClient($http, toastr);
      launcher.launch($scope, $routeParams.name);
      $scope.launcher = launcher;
    }]);

  app.controller('AppsLiveCtrl', ['$scope', '$http', '$routeParams', '$sce',
    function ($scope, $http, $routeParams, $sce) {
      var item = $routeParams.name;
      setTitle(item);
      setNavColor('green');
      $http.get('/apps/' + item + '/port').
      success(function(data, status, headers, config) {
        if (data) {
          console.log('GET /apps/' + item + '/port ->' + data);
          $scope.url = 'http://' + window.location.host + ':' + data;
          iframe = document.getElementById('live');
          $scope.go = function(towards) {
            console.log('go %s', towards);
            iframe.contentWindow.history.go(towards);
          };
          $scope.href = $sce.trustAsResourceUrl($scope.url);
        } else {
          window.location.assign("/");
        }
      }).
      error(function(data, status, headers, config) {
        console.error(data);
        window.location.assign("/");
      });
    }]);

  app.controller('AppsNewCtrl', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http) {

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

      $scope.gitURL = '';      
      $scope.gitSubmit = function() {
        var client = new AppsClient($http);
        client.install($scope);
      };


    }]);
})();