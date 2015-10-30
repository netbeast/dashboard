/* global angular, toastr, $ */

angular.module('Dashboard')

.directive('nbNavbar', function () {
  console.log('loaded')
  return {
    restrict: 'E',
    templateUrl: 'views/navbar.html'
  }
})

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
          console.log('Success on removing -> %s', data)
          toastr.success($scope.app + ' succesfully removed')
          $element.hide()
        })
      }
    }

    $scope.launch = function () {
      Activity.launch($scope.app).success(function (data) {
        console.log('Success on launching -> %s', data)
        toastr.success($scope.app + ' launched', 'Dashboard')
      })
    }

    $scope.stop = function () {
      Activity.stop($scope.app.name).success(function (data) {
        console.log('Success on stopping -> %s', data)
        // modify $e
      })
    }
  }]

  self.link = function ($scope, $element) {
    $scope.visible = false
    $scope.toggleMenu = function (event) {
      $scope.visible = !$scope.visible
      if ($scope.visible) {
        $window.onclick = function (event) {
          $scope.visible = false
          $window.onclick = null
          $scope.$apply()
        }
      }
    }
  }

  return self
}]) // - directive

// .directive('ngRightClick', ['$parse', function ($parse) {
//   return function (scope, element, attrs) {
//     var fn = $parse(attrs.ngRightClick)
//     element.bind('contextmenu', function (event) {
//       scope.$apply(function () {
//         event.preventDefault()
//         fn.call(this, scope, {$event: event})
//       })
//     })
//   }
// }])

.directive('nbMetaDescription', function () {
  return {
    restrict: 'E',
    scope: { value: '=content' },
    link: function (scope) {
      $('meta[name=description]').attr('content', scope.value)
    }
  }
})

.directive('nbTitle', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { value: '=' },
    controller: function ($scope) {
      $rootScope.title = ' Netbeast | ' + $scope.value
    }
  }
}])
