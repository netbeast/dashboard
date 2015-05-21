angular.module("Dashboard")
.factory('toastr', function () {
    return {
        info: function(text) {
            toastr.info(text,"Success");
        },
        success: function (text) {
            toastr.success(text,"Success");
        },
        error: function (text) {
            toastr.error(text, "Error");
        },
    };
});


angular.module("Dashboard")
.factory("Activities", ['$scope', '$http', 
	function ActivitiesFactory($scope, $http) {
		return {
			all: function() {
				return $http.get('/activities/');
			},
			launch: launch,
                  stop: function(app) {
                   $http.delete('/activities/' + apps);
             }
       }
 }]);

function launch(app) {
      return $http.put('/launch/' + item).
      success(function(data, status, headers, config) {
            console.log('PUT /launch/' + item + ' -> (' + status + ') ' + data.port);
            if (data.port) {
                  scope.href = 'http://' + window.location.host + ':' + data.port;
                  return;
            }
            // Force new connection after disconnect to
            // restart app
            ws = io.connect('/' + item, {'forceNew': true})
            .on('connection', function () {
                  console.log('ws/%s: server fetched.', item);
            })
            .on('stdout', function (stdout) {
                  toastr.info(stdout, item);
                  console.log('ws/%s/stdout: %s', item, stdout);
            })
            .on('stderr', function (stderr) {
                  toastr.danger(stderr, item);
                  console.log('ws/%s/stderr: %s', item, stderr);
            })
            .on('close', function() {
                  console.log('ws/%s/close!', item);
                  ws.close().disconnect();
            })
            .on('ready', function (port) {
                  console.log('ws/%s/ready!');
                  scope.href = 'http://' + window.location.host + ':' + port;
            });
      }).error(function(data, status, headers, config) {
            toastr.danger(Dashboard, data);
            console.log(status + ' when PUT /launch/' + item + ' -> ' + data);
      });
}