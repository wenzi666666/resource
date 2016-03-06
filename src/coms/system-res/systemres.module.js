/**
 * Angular module for frontend.examples.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
	'use strict';

	// Define frontend.public module

	ApplicationConfiguration.registerModule('webApp.coms.systemres');
	// Module configuration
	angular.module('webApp.coms.systemres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('systemres', {
						url: '/systemres',
						views: {
							'content@': {
								templateUrl: '/coms/system-res/views/systemres.html',
								controller: 'SystemResController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header.html',
								controller: 'LayoutntController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('SystemRes', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("SystemResController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				
				console.log("test")
			}
		])
}());