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

    self.update = function (app, pkg) {
      console.log(pkg)
      return $http.put('/apps/' + app, pkg)
      .error(function(data, status) {
        toastr.error(data, 'An error has occurred when updating the app')
        console.error(__filename + ' @ self.update()' + data)
      })
    }
    
    self.remove = self.delete = function (app) {
      return $http.delete('/apps/' + app)
      .error(function(data, status) {
        toastr.error(data, 'An error has occurred when removing the app')
        console.error(__filename + ' @ self.remove()' + data)
      })
    }

    return self
  }])