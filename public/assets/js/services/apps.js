'use strict'

angular.module("Dashboard")
.factory("Apps", ['$http', '$sce', '$location',  
  function ActivitiesFactory ($http, $sce, $location) {

    var self = {}
    
    self.get = function(app) {
      return $http.get('/apps/' + app).error(function(data) {
        console.log(data.toString())  
        toastr.error(data.toString())
        $location.path('/')
        $location.replace()
      })
    }

    self.all = function() {
      return self.get('')
    }

    self.getReadme = function(app) {
      return $http.get('/apps/' + app + '/readme')
      .error(function(data) {
        console.log(data.toString())  
        toastr.error(data.toString())
      })
    }
    
    self.remove = function(app) {
      return $http.delete('/apps/' + app)
      .success(function(data, status) {
        toastr.success(app + " succesfully removed")
        var icon = document.getElementById(app)
        icon.parentElement.removeChild(icon)
      }).error(function(data, status) {
        toastr.error(data, 'An error has occurred when removing the app')
        console.error(__filename + ' @ self.remove()' + data)
      })
    }

    return self
  }])