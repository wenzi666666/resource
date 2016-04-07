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
		.controller("TreeController", ['$scope', '$stateParams', '$state', '$location', 'Tree','$localStorage',
			function($scope, $stateParams, $state, $location, Tree,$localStorage) {
				// 监听目录树变化
				$scope.$on("currentTreeIdUpdate",function(e, d) {
					Tree.getTree({
						pnodeId: d
					}, function(data) {
						 $scope.treedata = data.data;
						 console.log("tree data:", data.data);
						 // 目录树默认选择 当前选择 > 默认第一个节点选择 
//						 if($localStorage.currentTreeNode) {
//							var currentTreeNode = $localStorage.currentTreeNode;
//						}else {
							var currentTreeNode = data.data[0];
							//缓存用户当前 版本
							$localStorage.currentTreeNode =  currentTreeNode;
//						}
						// 选择
//						$scope.selected = $scope.treedata[currentTreeNode.i];
						//展开第一个节点
						$scope.expandedNodes = [$scope.treedata[0]];
						// 广播当前节点选择
					    $scope.$emit("currentTreeNode", currentTreeNode)
					})
				})
				
				//根据选择节点广播
				$scope.showSelected = function(sel) {
			       // 广播当前节点选择
					$scope.$emit("currentTreeNode", sel);
					//缓存用户当前 版本
					$localStorage.currentTreeNode =  sel;
			    };
							
			}
		])
}());