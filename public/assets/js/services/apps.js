'use strict'

angular.module("Dashboard")
.factory("Apps", ['$http', '$sce', 'toastr', 
  function ActivitiesFactory ($http, $sce, toastr) {

    var self = {}
    self.get = function(app) {
      return $http.get('/apps/' + app).error(function(data) {
        console.log("error fetching app: %s", data.toString())  
        toastr.error("Error fetching app. " + data.toString())
      })
    }
    self.all = function() {
      return self.get('')
    }
    self.getReadme = function(app) {
      return $http.get('/apps/' + app + '/readme').error(function(data) {
        console.log("error fetching readme: %s", data.toString())  
        toastr.error("Error fetching readme. " + data.toString())
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