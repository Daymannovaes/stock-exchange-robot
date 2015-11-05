(function(undefined) {
	"use strict";
	
	define(function() {
		return [
			"$scope",
			"users",
			function($scope, users) {
				$scope.users = users.data;
			}
		];
	});

})();