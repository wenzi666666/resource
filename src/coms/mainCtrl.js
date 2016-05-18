(function() {
	'use strict';
	// 主controller
	angular.module('webApp')
		.controller("MainCtrl", ['$scope', '$rootScope', '$window', '$localStorage',
			function($scope, $rootScope, $window, $localStorage) {
				// 监听 目录树更改
				$scope.$on("currentTreeId", function(e, d) {
					$scope.$broadcast('currentTreeIdUpdate', d);
				})
				
				// 监听 目录树 选择
				$scope.$on("currentTreeNode", function(e, d) {
					$scope.$broadcast('currentTreeNodeChange', d);
				})
				
				// 无资源时显示
				$scope.$on("noTreeData", function(e, d) {
					$scope.$broadcast('noTreeDataChange', d);
				})
			}
		]);
}());