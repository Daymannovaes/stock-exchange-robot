(function(undefined) {
	"use strict";
	
	define(["angular"], function(angular) {
		var siteApp = angular.module("siteApp", [
			"ngRoute",
            "ngCookies",
            "siteApp.services",
            "siteApp.directives",
            "siteApp.filters",
            "siteApp.controllers"
		]);

		siteApp.run([
			"$rootScope",
			"$route",
			function($rootScope, $route) {
				$rootScope.user = {
					isAdmin: true
				};

	            $rootScope.$on("$routeChangeSuccess", function() {
	                $rootScope.$path = $route.current.$path;

	            });
			}
		]);

		return siteApp;
	});

})();