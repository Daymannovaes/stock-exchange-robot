(function(undefined) {
	"use strict";
	
	requirejs.config({
		paths: {
			"angular": ["/public/bower_components/angular/angular.min"],
			"angular-route": ["/public/bower_components/angular-route/angular-route.min"],
			"angular-cookies": ["/public/bower_components/angular-cookies/angular-cookies.min"]
		},
		shim: {
			"angular" : {
                exports: "angular"
            },
            "angular-route": {
                deps: ["angular"],
                exports: "angular"
            },
            "angular-cookies" : {
                deps: ["angular"],
                exports: "angular"
            }
		}
	});

	require(["angular", "angular-route", "angular-cookies", "site", "routes/site-route",
		"controllers/controllers", "services/services", "directives/directives", "filters/filters"], function(angular) {
		angular.bootstrap(document, ["siteApp"]);
	});
})();