/**
 * 备课夹共用
 */
(function() {
	'use strict';
	// 选择备课夹 共用
	angular.module('webApp.coms.layout')
		.controller("selectPrepareCtrl", ['$scope', '$stateParams', '$state', '$location', '$uibModalInstance', 'Prepare', 'ModalMsg', 'Tree','$localStorage', 
			function($scope, $stateParams, $state, $location, $uibModalInstance, Prepare, ModalMsg, Tree,$localStorage) {
				$scope.moveOk = function() {
					console.log("test");
					var tmpVal = {
						'prepareId': $scope.selectedPrepare.id,
					}
					$uibModalInstance.close(tmpVal);
				};
	
				$scope.moveCancel = function() {
					$uibModalInstance.dismiss('cancel');
				};
	
				// 监听目录树变化
				Tree.getTree({
					pnodeId: $localStorage.currentMaterial.id,
				}, function(data) {
					console.log("tree data:", data.data);
					$scope.treedataSelect = data.data;
					//展开第一个节点
					$scope.expandedNodes = [$scope.treedataSelect[0]];
					 console.log("tree data:", data.data);
				})
				
				// 目录树 控制
				$scope.showTree = false;
				$scope.treeTrigger = function() {
					$scope.showTree = true;
				}
				$scope.closeThis = function() {
					$scope.showTree = false;
				}
				
				// 目录树节点选择
				$scope.currentNode = $localStorage.currentTreeNode;
				
				$scope.showSelected = function(sel) {
					$scope.currentNode =  sel;
					//获取当前节点下的所有备课夹
					Prepare.baseGetApi({
						tfcode: $scope.currentNode.tfcode
					}, function(data) {
						$scope.prepares = data.data;
						if($scope.prepares.length == 0) {
							$uibModalInstance.close();
							ModalMsg.alert("当前目录下没有备课夹，请重新选择！");
						}
					})
				};
				
				$scope.selectedPrepare = {};
				$scope.selectPrepare = function(prepare) {
					var p = JSON.parse(prepare);
					$scope.selectedPrepare.id = p.id;
				}
			}
		])
}());