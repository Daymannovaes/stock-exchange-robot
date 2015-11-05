(function(undefined) {
	"use strict";

	function ucFirst(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
	define(function() {
		return [
			"$scope",
			"UserService",
			function($scope, UserService) {
				$scope.addType = "user";
				$scope.user = {};
				$scope.unit = {};
				$scope.question = {};

				$scope.addUser = function() {
					UserService.addUser($scope.user)
						.success(function(status, data) {
							data = null;
						});
				};

				$scope.add = function(addType) {
					$scope["add" + ucFirst(addType)]();
				};
			}
		];
	});

})();