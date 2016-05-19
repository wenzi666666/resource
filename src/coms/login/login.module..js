/**
 * 登陆 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.login')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('login', {
						url: '/login',
						data: {
							access: 0
						},
						views: {
							'content@': {
								templateUrl: '/coms/login/views/login.html',
								controller: 'LoginController'
							}
						}
					})
			}
		])
		.factory('Login', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: TomcatUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("LoginController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
			
			}
		])
}());