//
// 
//

API = {};
API.delete = function (name) {
  console.log("deleting app named " + name);
};

// Simple GET request example : https://docs.angularjs.org/api/ng/service/$http
API.read = function ($scope, item) {
  if (item) {
    this.HTTP.get('/apps/' + item).
    success(function(data, status, headers, config) {
      $scope.app = data;
    }).
    error(function(data, status, headers, config) {
      alert('Could not load app details :[ ');
    });
  } else {
    this.HTTP.get('/apps').
    success(function(data, status, headers, config) {
       console.log('RESPONSE: ' + data);
       $scope.apps = data;
    }).
    error(function(data, status, headers, config) {
      alert('Could not load app list :[ ');
    });
  }
};
