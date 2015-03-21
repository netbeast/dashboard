function API ($http, resource) {
  this.$http = $http;
  this.resource = '/' + resource;
};

// Simple GET request example : https://docs.angularjs.org/api/ng/service/$http
API.prototype = {
  constructor: API,
  route: function (resource) {
    if(!resource) {
      return this.resource;
    } else {
      this.resource =  '/' + resource;
    }
  },
  read: function ($scope, item) {
    if (item) {
      this.$http.get(this.resource + '/' + item).
      success(function(data, status, headers, config) {
        $scope.app = data;
      }).
      error(function(data, status, headers, config) {
        alert(data);
      });
    } else {
      this.$http.get(this.resource).
      success(function(data, status, headers, config) {
        console.log('RESPONSE: ' + data);
        $scope.apps = data;
      }).
      error(function(data, status, headers, config) {
        alert(data);
      });
    }
  },
  delete: function (item) {
    var msg = 'Are you sure you want to uninstall ' + item + '?';
    if (confirm(msg)) {
      this.$http.delete(this.resource + '/' + item).
      success(function(data, status, headers, config) {
        console.log('RESPONSE: ' + data);
        itemHTML = document.getElementById(item);
        itemHTML.parentElement.removeChild(itemHTML);
      }).
      error(function(data, status, headers, config) {
        alert(data);
      });
    }
  }
};
