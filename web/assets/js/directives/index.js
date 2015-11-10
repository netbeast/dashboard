/* global angular $ */

require('./app')

angular.module('Dashboard')

.directive('nbNavbar', function () {
  console.log('loaded')
  return {
    restrict: 'E',
    templateUrl: 'views/navbar.html',
    controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
      $scope.user = $rootScope.user
    }]
  }
})

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
