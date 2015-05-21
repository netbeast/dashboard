anguler.module("Dashboard")
.factory("Activities", function ActivitiesFactory() {
	return {
		all: function() {
			return $http.get('/activities/');
		},
		launch: function(app) {
			return $http.put('/launch/' + app);
		}
	}
});