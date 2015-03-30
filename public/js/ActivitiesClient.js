// Activities
function ActivitiesClient ($http) {
  this.$http = $http;
};

// Simple GET request example : https://docs.angularjs.org/api/ng/service/$http
ActivitiesClient.prototype = {
  constructor: ActivitiesClient,
  open: function(port) {
    window.location.port = port;
  },
  launch: function ($scope, item) {
    this.$http.put('/launch/' + item).
    success(function(data, status, headers, config) {
      console.log('PUT /launch/' + item + ' -> ' + data);
      $scope.port = data.port;
    }).
    error(function(data, status, headers, config) {
      console.log(status + ' when PUT /launch/'+item+' -> ' + data);
    });
  },
  read: function ($scope) {
      this.$http.get('/activities/').
      success(function(data, status, headers, config) {
        console.log('GET /activities/ ->' + data);
        $scope.apps = data;
      }).
      error(function(data, status, headers, config) {
        console.log(status + ' when GET /activities -> ' + data);
      });
  },
  delete: function (item) {
    var msg = 'Are you sure you want to stop ' + item + '?';
    if (confirm(msg)) {
      this.$http.delete('/activities/' + item).
      success(function(data, status, headers, config) {
        console.log('DELETE  /activities/' + item + ' -> ' + data);
        itemHTML = document.getElementById(item);
        itemHTML.parentElement.removeChild(itemHTML);
      }).
      error(function(data, status, headers, config) {
        console.log(status + ' when DELETE /apps -> ' + data);
      });
    }
  }
};
