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
				 // 目录树样式
				 $scope.opts = {
			         injectClasses: {
			             "ul": "c-ul",
			             "li": "c-li",
			             "liSelected": "c-liSelected",
			             "iExpanded": "c-iExpanded",
			             "iCollapsed": "c-iCollapsed",
			             "iLeaf": "c-iLeaf",
			             "label": "c-label",
			             "labelSelected": "c-labelSelected"
			         }
			     };
				// 监听目录树变化
				$scope.$on("currentTreeIdUpdate",function(e, d) {
					Tree.getTree({
						pnodeId: d
					}, function(data) {
						 $scope.treedata = data.data;
						 console.log("tree data:", data.data);
						 // 目录树默认选择 当前选择 > 默认第一个节点选择 
						 if(!!$localStorage.currentTreeNode && !!$localStorage.selectChange) {
							var currentTreeNode = $localStorage.currentTreeNode;
						}else {
							var currentTreeNode = data.data[0];
							//缓存用户当前 版本
							$localStorage.currentTreeNode =  currentTreeNode;
						}
						// 选择
						$scope.expandedNodes = []
						if(!!$localStorage.selectChange) {
							var nodes = currentTreeNode.i.split('.');
							console.log(nodes)
							if(nodes.length == 1)
								$scope.selected = $scope.treedata[nodes[0]-1];
							else if(nodes.length == 2){
								$scope.selected = $scope.treedata[nodes[0]-1].children[nodes[1]-1];
								$scope.expandedNodes[0] = $scope.selected;
							} else if(nodes.length == 3) {
								$scope.selected = $scope.treedata[nodes[0]-1].children[nodes[1]-1].children[nodes[2]-1];
								$scope.expandedNodes[0] = $scope.selected;
							} else
								$scope.selected = $scope.treedata[0];
						}else{
							$scope.selected = $scope.treedata[0];
						}
							
							
						console.log("$scope.selected:", $scope.selected)
						//展开第一个节点
						$scope.expandedNodes = $scope.expandedNodes.concat([$scope.treedata[0],$scope.treedata[0].children[0],$scope.treedata[0].children[1],$scope.treedata[0].children[2],$scope.treedata[0].children[3]]);
						console.log($scope.expandedNodes)
						// 广播当前节点选择
					    $scope.$emit("currentTreeNode", currentTreeNode);
					})
				})
				
				//根据选择节点广播
				$scope.showSelected = function(sel) {
				   // 设定  目录树 改变了
				   $localStorage.selectChange = true;
				   console.log("tree:", sel)
			       // 广播当前节点选择
					$scope.$emit("currentTreeNode", sel);
					//缓存用户当前 版本
					$localStorage.currentTreeNode =  sel;
	
			    };
							
			}
		])
}());