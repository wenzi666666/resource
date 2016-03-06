/**
 * Angular module for frontend.examples.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
	'use strict';

	// Define frontend.public module

	ApplicationConfiguration.registerModule('webApp.coms.layout');
	// Module configuration
	angular.module('webApp.coms.layout')
		.factory('Layout', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("LayoutntController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				
			}
		])
}());