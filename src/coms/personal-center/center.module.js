/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.systemres')
		.config(['$stateProvider', 
			function($stateProvider) {
				$stateProvider
					.state('personalcenter', {
						url: '/personalcenter',
						views: {
							'content@': {
								templateUrl: '/coms/presonal-center/views/personal-center.html',
								controller: 'personalCenterController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		
		.controller("personalCenterController", ['$scope', '$stateParams', '$state', '$location', '$http',
			function($scope, $stateParams, $state, $location, $http) {
				$scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
			}
		])
})
