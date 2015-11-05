(function(undefined) {
	"use strict";
	
	define(function() {
		return [
			"$http",
			function($http) {
				this.getAllUsers = function() {
					return $http.get("/users");
				};

				this.addUser = function(user) {
					return $http.post("/user", user);
				};
			}
		];
	});

})();