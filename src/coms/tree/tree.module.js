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
					getTree: {method: "GET",url: window.TomcatUrl + "/resRestAPI/v1.0/contents"}
				})
			}
		])
		.controller("TreeController", ['$scope', '$stateParams', '$state', '$location', 'Tree','$localStorage','$timeout',
			function($scope, $stateParams, $state, $location, Tree, $localStorage,$timeout) {
				// 监听目录树变化
				$scope.$on("currentTreeIdUpdate",function(e, d) {
					$scope.treedata = [];
					$scope.expandedNodes = [];
					$scope.selected = [];
					window.allNodes = [];
					Tree.getTree({
						pnodeId: d
					}, function(data) {
						$scope.treedata = data.data;
//						// 目录树默认选择 当前选择 > 默认第一个节点选择 
						if(!!$localStorage.currentTreeNode && !!$localStorage.selectChange) {
							var currentTreeNode = $localStorage.currentTreeNode;
						}else {
							var currentTreeNode = data.data[0];
//							//缓存用户当前 版本
							$localStorage.currentTreeNode =  currentTreeNode;
						}
						//记住上次选择处理
						
						var getLastTreeSelect = function(){
							if(!!$localStorage.selectChange) {
								var nodes = currentTreeNode.i.split('.');
								// console.log(nodes.length)
								if(nodes.length == 1) {
									$scope.selected = $scope.treedata[nodes[0]-1];
	//								$scope.expandedNodes = $scope.expandedNodes.concat([$scope.treedata[nodes[0]-1],$scope.treedata[nodes[0]-1].children[0],$scope.treedata[nodes[0]-1].children[1],$scope.treedata[nodes[0]-1].children[2],$scope.treedata[nodes[0]-1].children[3]]);
								}else if(nodes.length == 2){
									$scope.selected = $scope.treedata[nodes[0]-1].children[nodes[1]-1];
	//								$scope.expandedNodes = $scope.expandedNodes.concat([$scope.treedata[nodes[0]-1],$scope.selected]);
								} else if(nodes.length == 3) {
									$scope.selected = $scope.treedata[nodes[0]-1].children[nodes[1]-1].children[nodes[2]-1];
	//								$scope.expandedNodes = $scope.expandedNodes.concat([$scope.treedata[nodes[0]-1],$scope.treedata[nodes[0]-1].children[nodes[1]-1],$scope.selected]);
								} else if(nodes.length == 4) {
									$scope.selected = $scope.treedata[nodes[0]-1].children[nodes[1]-1].children[nodes[2]-1].children[nodes[3]-1];
	//								$scope.expandedNodes = $scope.expandedNodes.concat([$scope.treedata[nodes[0]-1],$scope.treedata[nodes[0]-1].children[nodes[1]-1],$scope.treedata[nodes[0]-1].children[nodes[1]-1].children[nodes[2]-1],$scope.selected]);
								}else if(nodes.length == 5) {
									$scope.selected = $scope.treedata[nodes[0]-1].children[nodes[1]-1].children[nodes[2]-1].children[nodes[3]-1].children[nodes[4]-1];
	//								$scope.expandedNodes = $scope.expandedNodes.concat([$scope.treedata[nodes[0]-1],$scope.treedata[nodes[0]-1].children[nodes[1]-1],$scope.treedata[nodes[0]-1].children[nodes[1]-1].children[nodes[2]-1],$scope.treedata[nodes[0]-1].children[nodes[1]-1].children[nodes[2]-1].children[nodes[3]-1], $scope.selected]);
								}else
									$scope.selected = $scope.treedata[0];
							}else{
								$scope.selected = $scope.treedata[0];
								//展开第一个节点
	//							$scope.expandedNodes = $scope.expandedNodes.concat([$scope.treedata[0],$scope.treedata[0].children[0],$scope.treedata[0].children[1],$scope.treedata[0].children[2],$scope.treedata[0].children[3]]);
							}
						}

						// 目录树全展开
						window.addToAllNodes($scope.treedata);
						$timeout(function(){
							$scope.expandedNodes = window.allNodes.slice(0, 100);
							getLastTreeSelect();
						})
						
						// 广播当前节点选择
					    $scope.$emit("currentTreeNode", currentTreeNode);
					})
				})
				
				//根据选择节点广播
				$scope.showSelected = function(sel) {
				   // 设定  目录树 改变了
				   $localStorage.selectChange = true;
//				   console.log("tree:", sel)
			       // 广播当前节点选择
					$scope.$emit("currentTreeNode", sel);
					//缓存用户当前 版本
					$localStorage.currentTreeNode =  sel;
	
			    };
							
			}
		])
}());