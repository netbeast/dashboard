/* global angular, toastr */

angular.module('Dashboard')
.directive('app', ['App', 'Activity', '$window',
function (App, Activity, $window) {
  var self = {}
  self.scope = { app: '=app'	}
  self.restrict = 'E'
  self.templateUrl = 'views/apps/_app.html'

  self.controller = ['$scope', '$element', function ($scope, $element) {
    $scope.delete = function () {
      var msg = 'Are you sure you want to uninstall ' + $scope.app + '?'

      if (window.confirm(msg)) {
        App.delete($scope.app).success(function (data) {
          console.log('Success on removing -> %s', $scope.app)
          toastr.success($scope.app + ' succesfully removed')
          $element.hide()
        })
      }
    }

    $scope.launch = function () {
      Activity.launch($scope.app).success(function (data) {
        console.log('Success on launching -> %s', $scope.app)
        toastr.success($scope.app + ' launched', 'Dashboard')
      })
    }

    $scope.stop = function () {
      Activity.stop($scope.app).success(function (data) {
        console.log('Success on stopping -> %s', $scope.app)
        $element.hide()
      })
    }
  }]

  self.link = function ($scope, $element) {
  }

  return self
}]) // - directive
