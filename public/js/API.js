//
// 
//

function API ($http) {
    this.$http = $http;
};

// Simple GET request example : https://docs.angularjs.org/api/ng/service/$http
API.prototype = {
    constructor: API,
    read: function ($scope, item) {
        if (item) {
            this.$http.get('/apps/' + item).
                success(function(data, status, headers, config) {
                    $scope.app = data;
                }).
                error(function(data, status, headers, config) {
                    alert(data);
                });
        } else {
            this.$http.get('/apps').
                success(function(data, status, headers, config) {
                    console.log('RESPONSE: ' + data);
                    $scope.apps = data;
                }).
                error(function(data, status, headers, config) {
                    alert(data);
                });
        }
    },
    delete: function (name) {
        console.log("deleting app named " + name);
    }
};