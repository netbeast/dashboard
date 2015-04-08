var toastr;

// Activities
function ActivitiesClient ($http, toaster) {
  this.$http = $http;
  toastr = toaster;
};

// Simple GET request example : https://docs.angularjs.org/api/ng/service/$http
ActivitiesClient.prototype = {
  constructor: ActivitiesClient,
  open: function(port) {
    console.log('Redirecting to port %s', port);
    window.location.port = port;
  },
  launch: function ($scope, item) {
    var ws; // app web socket
    this.$http.put('/launch/' + item).
    success(function(data, status, headers, config) {
      console.log('PUT /launch/' + item + ' -> (' + status + ')' + data);
      ws = io.connect('http://localhost:80/' + item);
      $scope.port = data.port;
      ws.on('hello', function () {
        console.log('ws/%s: server fetched.', item);
      });
      ws.on('stdout', function (stdout) {
        toastr.info(stdout, item);
        console.log('ws/%s/stdout: %s', item, stdout);
      });
      ws.on('stderr', function (stderr) {
        toastr.error(stderr, item);
        console.log('ws/%s/stderr: %s', item, stderr);
      });
      ws.on('close', function() {
        console.log('ws/%s/close!', item);
        ws.close();
      });
    }).
    error(function(data, status, headers, config) {
      $scope.error = data;
      console.log(status + ' when PUT /launch/' + item + ' -> ' + data);
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
