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
					},
					moveItemInPrepare: {
						method: "POST",
						url: BackendUrl + "/resRestAPI/v1.0/prepareContent/"
					}
				})
			}
		])
		.controller("PrepareController", ['$scope', '$stateParams', '$state', '$location', '$uibModal', 'Prepare', 'ModalMsg', 'Tree', 'Res', '$localStorage',
			function($scope, $stateParams, $state, $location, $uibModal, Prepare, ModalMsg, Tree, Res, $localStorage) {
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
						if(data.data && data.data.length > 0) $scope.listData[0].active = true;
						//获取备课夹详细内容
						_.each(data.data, function(v,i) {
							getPrepareDetails(v.id, i);
						})
					})
				}


				//监听课本选择
				$scope.$on("currentTreeIdUpdate", function(e, tfcode) {
					console.log("test");
					getPrepare(tfcode);
				})

				// 读取 单个备课夹详细内容
				var getPrepareDetails = function(id,index) {
					Prepare.prepareContent({
						id: id
					}, function(data) {
						console.log("test", data.data);
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

				//备课夹中内容操作——1.置底 2.上移 3.下移 4.置顶
				$scope.setItem = function(id, index, type) {
					var prevId = 0;
					var nextId = 0;
					console.log($scope.listData);
					console.log(index);
					var list = $scope.listData[index].children;
					var len = list.length;
					var msg = "";
					var successMsg = "";
					//置底
					if(type == 1) {
						prevId = id;
						nextId = list[len-1].id;
						if(prevId == nextId) {
							msg = "已是最后一条内容！";
						}
					}
					//上移
					else if(type == 2) {
						nextId = id;
						var prevIndex = 0;
						_.each(list, function(item,i) {
							if(item.id == id) {
								prevIndex = i-1;
							}
						})
						if(prevIndex < 0) {
							msg = "当前已是第一条!";
						}
						else prevId = list[prevIndex].id;
					}
					//下移
					else if(type == 3) {
						prevId = id;
						var nextIndex = 0;
						_.each(list, function(item,i) {
							if(item.id == id) {
								nextIndex = i+1;
							}
						})
						if(nextIndex == list.length) {
							msg = "当前已是最后一条!";
						}
						else nextId = list[nextIndex].id;
					}
					//置顶
					else if(type == 4) {
						prevId = list[0].id;
						if(prevId == id) {
							msg = "当前已是第一条！";
						}
						else nextId = id;
					}

					if(msg.length == 0) {
						Prepare.moveItemInPrepare({
							prevId: prevId,
							nextId: nextId,
							_method: "BATCH"
						}, function(data) {
							console.log(data);
						})
					}
					else {
						ModalMsg.logger(msg);
					}
				}

				//备课夹中内容操作——删除
				$scope.deleteItem = function() {

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