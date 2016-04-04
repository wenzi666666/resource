/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.prepare')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('prepare', {
						url: '/prepare',
						views: {
							'content@': {
								templateUrl: '/coms/prepare/views/prepare.html',
								controller: 'PrepareController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header4.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('Prepare', ['$resource',
			function($resource) {
				return $resource(BackendUrl + "/resRestAPI/v1.0/prepare/:id", {
					id: '@_id'
				}, {
					baseGetApi: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/prepare/"
					},
					basePostApi: {
						method: "POST",
						url: BackendUrl + "/resRestAPI/v1.0/prepare/"
					},
					prepareContent: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/prepareContent/:id", 
					    params:{ 
					        id:'@id'
					    }
					},
					addResToPrepareId: {
						method: "POST",
						url: BackendUrl + "/resRestAPI/v1.0/prepareContent/:id", 
					    params:{ 
					        id:'@id'
					    }
					}

				})
			}
		])
		.controller("PrepareController", ['$scope', '$stateParams', '$state', '$location', '$uibModal', 'Prepare', 'ModalMsg', 'Tree','$localStorage',
			function($scope, $stateParams, $state, $location, $uibModal, Prepare, ModalMsg, Tree, $localStorage) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};

				// 关闭版本筛选
				$scope.closeCurrentVersion = function() {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					$scope.VM.isList = true;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
				}
				

				$scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;

				// list切换
				$scope.isList = true;
				$scope.switchList = true;
				$scope.switch = function(index) {
					_.each($scope.listData, function(v, i) {
						$scope.listData[i].active = false
					})
					$scope.listData[index].active = true
				}

				// 监听 目录树 选择
				$scope.$on("currentTreeNodeChange", function(e, d) {
					getPrepare(d.tfcode);
				})

				// 读取备课夹 列表
				var getPrepare = function(id) {
					Prepare.baseGetApi({
						tfcode: id
					}, function(data) {
						console.log(data.data);
						$scope.listData = data.data;
						$scope.listData[0].active = true
						//获取备课夹详细内容
						_.each(data.data, function(v,i) {
							getPrepareDetails(v.id, i);
						})
					})
				}

				// 读取 单个备课夹详细内容
				var getPrepareDetails = function(id,index) {
					Prepare.prepareContent({
						id: id
					}, function(data) {
						console.log(data.data);
						$scope.listData[index].children = data.data;
					})
				}

				// 删除备课夹
				$scope.deletePrepare = function(index, e) {
					e.stopPropagation();
					console.log($scope.listData[index])
					var deleteModal = ModalMsg.confirm("确定删除备课夹：" + $scope.listData[index].title);

					deleteModal.result.then(function(data) {
						Prepare.basePostApi({
							id: $scope.listData[index].id,
							_method: "DELETE"
						}, function(data) {

							getPrepare();
						})
					})
				}

				// 新建备课夹
				$scope.newPrepare = function() {

					var modalNewPrepare = $uibModal.open({
						templateUrl: "modal-prepare.html",
						controller: 'PrepareModalController',
					})

					//创建备课夹
					modalNewPrepare.result.then(function(data) {
						console.log(data)
						Prepare.basePostApi({
							tfcode: data.code,
							title: data.name
						}, function(d) {
							getPrepare(data.code);
						})
					});
				}
			}
		])

	.controller("PrepareModalController", ['$scope', '$stateParams', '$state', '$location', '$uibModalInstance', 'Prepare', 'ModalMsg', 'Tree','$localStorage',
		function($scope, $stateParams, $state, $location, $uibModalInstance, Prepare, ModalMsg, Tree,$localStorage) {

			$scope.prepareOK = function() {
				var tmpVal = {
					'code': $scope.currentNode.tfcode,
					'name': $scope.prepareName
				}
				$uibModalInstance.close(tmpVal);
			};

			$scope.prepareCancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

			// 监听目录树变化
			Tree.getTree({
				pnodeId: $localStorage.currentMaterial.id,
			}, function(data) {
				$scope.treedata = data.data;
				//展开第一个节点
				$scope.expandedNodes = [$scope.treedata[0]];
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
			$scope.currentNode = $localStorage.currentTreeNode
			$scope.showSelected = function(sel) {
				$scope.currentNode =  sel;
			};
		}
	])
}());