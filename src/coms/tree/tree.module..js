/**
 * 目录树 模块
 */
(function() {
	'use strict';

	// 目录树 相对独立，可直接在模块里注入
	ApplicationConfiguration.registerModule('webApp.coms.tree');
	
	// Module configuration
	angular.module('webApp.coms.tree')
	.factory('Tree', ['$resource',
			function($resource) {
				return $resource('',{},{
					getTree: {method: "GET",url: window.BackendUrl + "/resRestAPI/v1.0/contents"}
				})
			}
		])
		.controller("TreeController", ['$scope', '$stateParams', '$state', '$location', 'Tree',
			function($scope, $stateParams, $state, $location, Tree) {
				// 监听目录树变化
				$scope.$on("currentTreeIdUpdate",function(e, d) {
					Tree.getTree({
						pnodeId: d
					}, function(data) {
						 $scope.treedata = data.data;
						 console.log("tree data:", data.data)
						 
						 $scope.$emit("currentTreeTFCode", 'RJXX02010102')
					})
				})
			}
		])
}());