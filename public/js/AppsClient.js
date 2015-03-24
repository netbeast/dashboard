function AppsClient ($http) {
  this.$http = $http;
};

// Simple GET request example : https://docs.angularjs.org/api/ng/service/$http
AppsClient.prototype = {
  constructor: AppsClient,
  read: function ($scope, item) {
    if (item) {
      this.$http.get('/apps/' + item).
      success(function(data, status, headers, config) {
        console.log('GET /apps/' + item + '/ ->' + data);
        $scope.app = data;
      }).
      error(function(data, status, headers, config) {
        alert(data);
      });
    } else {
      this.$http.get('/apps').
      success(function(data, status, headers, config) {
        console.log('GET /apps -> ' + data);
        $scope.apps = data;
      }).
      error(function(data, status, headers, config) {
        console.log(status + ' when GET /apps -> ' + data);
      });
    }
  },
  delete: function (item) {
    var msg = 'Are you sure you want to uninstall ' + item + '?';
    if (confirm(msg)) {
      this.$http.delete('/apps/' + item).
      success(function(data, status, headers, config) {
        console.log('DELETE  /apps/' + item + ' -> ' + data);
        itemHTML = document.getElementById(item);
        itemHTML.parentElement.removeChild(itemHTML);
      }).
      error(function(data, status, headers, config) {
        console.log(status + ' when DELETE /apps/'+item+' -> ' + data);
      });
    }
  }
};
