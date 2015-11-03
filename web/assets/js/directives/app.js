/* global angular, toastr, $ */

angular.module('Dashboard')
.directive('app', ['App', 'Activity', '$window', '$location',
function (App, Activity, $window, $location) {
  var self = {}
  self.scope = { app: '=app'	}
  self.restrict = 'E'
  self.templateUrl = 'views/apps/_app.html'

  self.controller = ['$scope', '$element', function ($scope, $element) {
    var app = $scope.app

    $scope.open = function () {
      console.log('open')
      $location.path('/apps/' + app.name)
    }

    $scope.delete = function () {
      var msg = 'Are you sure you want to uninstall ' + app.name + '?'

      if (window.confirm(msg)) {
        App.delete(app.name).success(function (data) {
          console.log('Success on removing -> %s', app.name)
          toastr.success(app.name + ' succesfully removed')
          $element.hide()
        })
      }
    }

    $scope.launch = function () {
      Activity.launch(app.name).success(function (data) {
        console.log('Success on launching -> %s', app.name)
        toastr.success(app.name + ' launched', 'Dashboard')
      })
    }

    $scope.stop = function () {
      Activity.stop(app.name).success(function (data) {
        console.log('Success on stopping -> %s', app.name)
        $element.hide()
      })
    }
  }]

  self.link = function ($scope, $element) {
  }

  return self
}]) // - directive

/* global angular, toastr */

angular.module('Dashboard')
.directive('pins', [function () {
  var self = {}
  self.scope = { app: '=app'	}
  self.restrict = 'E'
  self.templateUrl = 'views/apps/_pins.html'

  self.controller = ['$scope', '$element', function ($scope, $element) {
  }]

  self.link = function ($scope, $element) {
  }

  return self
}]) // - directive
