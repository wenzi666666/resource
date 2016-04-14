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
								templateUrl: '/coms/layout/footer/footer.html',
								controller: 'LayoutController'
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
					prepareContentBaseApi: {
						method: "POST",
						url: BackendUrl + "/resRestAPI/v1.0/prepareContent/"
					},
					zipPrepare: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/prepareZip/"
					},
					zipStatus: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/prepareZip_staus"
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
					$scope.VM.currentVersionTmpShow = false;
					$scope.VM.isList = true;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentMaterialTmpShow = false;
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
						console.log($scope.listData);
						if(data.data && data.data.length > 0) $scope.listData[0].active = true;
						//获取备课夹详细内容
						_.each(data.data, function(v,i) {
							getPrepareDetails(v.id, i);
							v.editPrepareTitle = false;
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

				//编辑备课夹标题
				// 
				$scope.editPrepare = function(index) {
					$scope.listData[index].editPrepareTitle = true;
				}

				//设定备课夹名称
				$scope.setPrepareTitle = function(index) {
					Prepare.basePostApi({
						id: $scope.listData[index].id,
						title: $scope.listData[index].title,
						_method: "PATCH"
					})
					$scope.listData[index].editPrepareTitle = false;
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
				$scope.setItem = function(id, childindex, index, type) {
					var prevId = 0;
					var nextId = 0;
					var prevIndex = 0;
					var nextIndex = 0;
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
						prevIndex = childindex;
						nextIndex = len-1;
						if(prevId == nextId) {
							msg = "已是最后一条内容！";
						}
					}
					//上移
					else if(type == 2) {
						nextId = id;
						nextIndex = childindex;
						if(childindex == 0) {
							msg = "当前已是第一条!";
						}
						else {
							prevIndex = nextIndex - 1;
							prevId = list[prevIndex].id;
						}
					}
					//下移
					else if(type == 3) {
						prevId = id;
						prevIndex = childindex;
						if(prevIndex == len-1) {
							msg = "当前已是最后一条!";
						}
						else {
							nextIndex = prevIndex + 1;
							nextId = list[nextIndex].id;
						}
					}
					//置顶
					else if(type == 4) {
						prevId = list[0].id;
						prevIndex = 0;
						nextIndex = childindex;
						if(childindex == 0) {
							msg = "当前已是第一条！";
						}
						else nextId = id;
					}

					if(msg.length == 0) {
						Prepare.prepareContentBaseApi({
							prevId: prevId,
							nextId: nextId,
							_method: "PATCH"
						}, function(data) {
							var tmpitem = $scope.listData[index].children[prevIndex];
							$scope.listData[index].children[prevIndex] = $scope.listData[index].children[nextIndex];
							$scope.listData[index].children[nextIndex] = tmpitem;
						})
					}
					else {
						ModalMsg.logger(msg);
					}
				}

				//备课夹中内容操作——删除，根据关联id
				$scope.deleteItem = function(id, msg) {
					Prepare.prepareContentBaseApi({
						ids: id,
						_method: "DELETE"
					}, function(data) {
						console.log(data);
						if(data.code == "OK") {
							if(msg == undefined) ModalMsg.logger("从备课夹删除资源成功！");
						}
						else {
							ModalMsg.logger("从备课夹删除资源失败，请重试！");
						}
					})
				}

				//下载资源
				$scope.resToBeZip = [];
				$scope.zipPrepare = function(id, flag) {
					//批量下载
					if(id == undefined) {

					}
					//单个资源下载
					else {
						console.log(id, flag);
						Prepare.zipPrepare({
							ids: id,
							fromflags: flag
						}, function(data) {
							console.log(data);
							var zipTaskId = data.data;
							setInterval(function() {
								Prepare.zipStatus({
									id: zipTaskId
								}, function(data) {
									if(data.status) {
										$scope.zipPath = data.zippath;
										//执行下载操作
										return;
									}
								})
							}, 100);
						})
					}
				}

				//编辑资源
				$scope.editRes = function(res) {

				}


				//移动到
				$scope.moveResTo = function(res) {
					var movePrepareModal = $uibModal.open({
						templateUrl: "move-prepare.html",
						controller: 'opModalController',
					})

					//移动到备课夹
					movePrepareModal.result.then(function(data) {
						console.log(data);
						Prepare.addResToPrepareId({
							id: data.prepareId,
							resIds: res.resId,
							fromFlags: res.fromFlag
						}, function(d) {
							if(d.code == "OK") {
								$scope.deleteItem(res.id, "");
								getPrepare();
							}
							else {
								ModalMsg.logger("移动到备课夹失败，请重试！")
							}
						})
					});
				}

				//复制到
				$scope.copyResTo = function(res) {

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

	.controller("opModalController", ['$scope', '$stateParams', '$state', '$location', '$uibModalInstance', 'Prepare', 'ModalMsg', 'Tree','$localStorage', 
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
				$scope.treedata = data.data;
				//展开第一个节点
				$scope.expandedNodes = [$scope.treedata[0]];
				// console.log("tree data:", data.data);
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
			Prepare.baseGetApi({
				tfcode: $scope.currentNode.tfcode
			}, function(data) {
				console.log("prepares", data.data);
				$scope.prepares = data.data;
				//获取备课夹详细内容
				
			})
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