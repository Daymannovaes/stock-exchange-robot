(function(undefined) {
	"use strict";
	
	define([
			"angular",
			"services/UserService",
			"services/MedalService"
		], function(angular, UserService, MedalService) {
			angular.module("siteApp.services", [])
				.service("UserService", UserService)
				.service("MedalService", MedalService);
		});

})();