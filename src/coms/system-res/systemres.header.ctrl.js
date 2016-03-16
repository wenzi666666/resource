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
//		.factory('SystemRes', ['$resource', 'Constants',
//			function($resource, Constants) {
//				return $resource('', {}, {
//					total: {
//						method: "GET",
//						url: BackendUrl + "/api/discuss/home/total"
//					}
//				})
//			}
//		])
		.controller("SystemResHeaderController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				
				$scope.Select.version = ["北师大版本","人教版","鲁教版","苏科版","粤教版","华东师大版本"];
			    $scope.Select.material = ["必修1","必修2","必修3","必修4","必修5","必修6"];
			    // 版本
			    $scope.Select.selectVersion = function(index){
			    	$scope.Select.currentVersion = $scope.Select.version[index];
			    	$scope.Select.currentVersionShow = true;
			    }
			    // 教材
			    $scope.Select.selectMaterial = function(index){
			    	$scope.Select.currentMaterial = $scope.Select.material[index];
			    	$scope.Select.currentMaterialShow = true;
			    }
				
			}
		])
}());