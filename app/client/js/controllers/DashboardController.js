(function(undefined) {
	"use strict";
	
	define(function() {
		return [
			"$scope",
			"$timeout",
			"medals",
			function($scope, $timeout, medals) {
				$scope.medals = medals.data;

				$timeout(function() {
					$(function () {
						$("[data-toggle='tooltip']").tooltip();
					});
				});
			}
		];
	});

})();