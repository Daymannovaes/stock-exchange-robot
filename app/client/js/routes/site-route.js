(function(undefined) {
	"use strict";
	
	define(["angular", "site"], function(angular, siteApp) {
		return siteApp.config(["$routeProvider", function ($routeProvider) {
			$routeProvider.when("/dashboard", {
                templateUrl: "/public/views/dashboard.html",
                controller  : "DashboardController",
                title : "Medalhas",
                $path: "dashboard",
                resolve : {
                    medals : ["MedalService", function(MedalService) {
                        return MedalService.getAllMedals();
                    }]
                }
            }).when("/ranking", {
                templateUrl: "/public/views/ranking.html",
                controller  : "RankingController",
                title : "Ranking",
                $path: "ranking",
                resolve : {
                    users : ["UserService", function(UserService) {
                        return UserService.getAllUsers();
                    }]
                }
            }).when("/question", {
                templateUrl: "/public/views/question.html",
                controller  : "QuestionController",
                title : "Pergunta da Semana",
                $path: "question",
                resolve : {
                    medals : [function() {
                        return [];
                    }]
                }
            }).when("/profile", {
                templateUrl: "/public/views/profile.html",
                controller  : "ProfileController",
                title : "Perfil",
                $path: "profile",
                resolve : {
                    medals : [function() {
                        return [];
                    }]
                }
            }).when("/about", {
                templateUrl: "/public/views/about.html",
                controller  : "AboutController",
                title : "Sobre",
                $path: "about",
                resolve : {
                    medals : [function() {
                        return [];
                    }]
                }
            }).when("/admin", {
                templateUrl: "/public/views/admin.html",
                controller  : "AdminController",
                title : "Administrador",
                $path: "admin",
                resolve : {
                    medals : [function() {
                        return [];
                    }]
                }
            }).otherwise({
                redirectTo  : "/dashboard"
            });
		}]);
	});
})();