/**
 * Angular module for frontend.examples.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
	'use strict';

	// Define frontend.public module

	ApplicationConfiguration.registerModule('webApp.coms.content');
	// Module configuration
	angular.module('webApp.coms.content')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('content', {
						url: '/content',
						data: {
							access: 0
						},
						views: {
							'content@': {
								templateUrl: '/coms/content/views/content.html',
								controller: 'ContentController'
							}
						}
					})
			}
		])
		.factory('Content', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("ContentController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				var menuRight = document.getElementById( 'right-menu' ),
				showRightPush = document.getElementById( 'showRightPush' ),
				body = document.body;

			
			showRightPush.onclick = function() {
				classie.toggle( this, 'active' );
				classie.toggle( body, 'cbp-spmenu-push-toleft' );
				classie.toggle( menuRight, 'cbp-spmenu-open' );
			};
			}
		])
}());