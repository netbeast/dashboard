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
    var ws, scope = $scope;
    this.$http.put('/launch/' + item).
    success(function(data, status, headers, config) {
      console.log('PUT /launch/' + item + ' -> (' + status + ')' + data);
      if (data.port) {
        scope.port = data.port;
        return;
      }
      ws = io.connect('/' + item)
      .on('connection', function () {
        console.log('ws/%s: server fetched.', item);
      })
      .on('stdout', function (stdout) {
        toastr.info(stdout, item);
        console.log('ws/%s/stdout: %s', item, stdout);
      })
      .on('stderr', function (stderr) {
        toastr.error(stderr, item);
        console.log('ws/%s/stderr: %s', item, stderr);
      })
      .on('close', function() {
        console.log('ws/%s/close!', item);
        ws.close();
      })
      .on('ready', function (port) {
        console.log('ws/%s/ready!');
        scope.port = port
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
