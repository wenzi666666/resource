/**
 * 备课夹共用
 */
(function () {
	'use strict';
	angular.module('webApp.coms.modal')
		.controller("selectPrepareCtrl", ['$scope', '$stateParams', '$state', '$location', '$uibModalInstance', 'Prepare', 'ModalMsg', 'Tree', '$localStorage', 'optypeText',
			function ($scope, $stateParams, $state, $location, $uibModalInstance, Prepare, ModalMsg, Tree, $localStorage, optypeText) {
				// 变量共享
				$scope.VM = {};
				$scope.optypeText = optypeText;
				$scope.moveOk = function () {
					if (!$scope.selectedPrepareId) {
						ModalMsg.logger("请选择收藏夹");
						return;
					}
					var tmpVal = {
						'prepareId': $scope.selectedPrepareId,
						'name': prepareName
					}
					$uibModalInstance.close(tmpVal);
				};

				$scope.moveCancel = function () {
					$uibModalInstance.dismiss('cancel');
				};

				// 监听目录树变化
				Tree.getTree({
					pnodeId: $localStorage.currentMaterial.id,
				}, function (data) {
					// console.log("tree data:", data.data);
					$scope.treedataSelect = data.data;
					// 目录树全展开
					window.addToAllNodes($scope.treedataSelect);
					$scope.expandedNodes = window.allNodes;

					$scope.selected = $scope.treedataSelect[0];
					$localStorage.tmpCurrentNode = $scope.selected;
					// console.log("tree data:", data.data);
					// 目录树节点选择
					$scope.currentNode = $scope.treedataSelect[0];
					getPrepare();
				})

				$scope.isActive = function (item) {
					return $scope.listSelected === item;
				};

				//获取当前节点下的所有备课夹
				var getPrepare = function () {
					// console.log($scope.currentNode.tfcode)
					Prepare.baseGetApi({
						tfcode: $scope.currentNode.tfcode
					}, function (data) {
						$scope.prepares = data.data;

					})
				}

				// 新建备课夹
				$scope.VM.newPrepare = "新建收藏夹";

				setTimeout(function () {
					$scope.$watch('VM.newPrepare', function (newVal, oldVal) {
						// console.log(newVal,oldVal)
						if (newVal !== oldVal && newVal != "新建收藏夹") {
							// console.log(newVal,oldVal)
							Prepare.basePostApi({
								tfcode: $scope.currentNode.tfcode,
								title: $scope.VM.newPrepare
							}, function (d) {
								$scope.VM.newPrepare = "新建收藏夹";
								// 获取备课夹
								getPrepare();
							})
						}
					});
				}, 2000)

				$scope.showSelected = function (sel) {
					$scope.selectedPrepareId = '';
					$scope.currentNode = sel;
					$localStorage.tmpCurrentNode = sel;
					getPrepare();
				};

				$scope.selectedPrepareId = '';
				var prepareName = '';
				$scope.selectPrepare = function (index) {
					$scope.listSelected = index;
					$scope.selectedPrepareId = $scope.prepares[index].id;
					prepareName = $scope.prepares[index].title;
				}
			}
		])
}());