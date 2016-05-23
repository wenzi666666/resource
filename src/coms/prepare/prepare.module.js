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
				return $resource(TomcatUrl + "/resRestAPI/v1.0/prepare/:id", {
					id: '@_id'
				}, {
					baseGetApi: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepare/"
					},
					//分页获取备课夹
					prepare_page: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepare_page/"
					},
					// 仅获取当前教材目录下的备课夹
					GetSelfPrepare: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/selfPrepare/"
					},
					basePostApi: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/prepare/"
					},
					prepareContent: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareContent/:id",
						params: {
							id: '@id'
						}
					},
					addResToPrepareId: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareContent/:id",
						params: {
							id: '@id'
						}
					},
					prepareContentBaseApi: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareContent/"
					},
					zipPrepare: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareZip/"
					},
					zipStatus: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareZip_staus"
					},
					//获取当前学科 所有备课夹
					prepare4book: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepare4book"
					},
					//获取最近三个备课夹，用于插入备课夹使用
					latestPrepare: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/latestPrepare"
					},
					//移动备课夹
					prepareMove: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareMove"
					},
					//复制备课夹
					prepareCopy: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareCopy"
					}
				})
			}
		])
		.controller("PrepareController", ['$scope', '$stateParams', '$state', '$location', '$uibModal', 'Prepare', 'ModalMsg', 'Tree', 'Res', '$localStorage','$timeout',
			function($scope, $stateParams, $state, $location, $uibModal, Prepare, ModalMsg, Tree, Res, $localStorage,$timeout) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				// 没有备课夹时显示
				$scope.noPrepare = false;

				// 关闭版本筛选
				$scope.closeCurrentVersion = function() {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentVersionTmpShow = false;
					$scope.VM.currentMaterialTmpShow = false;
					$scope.VM.isList = true;
					
					$localStorage.isPrepareList = $scope.VM.isList;
					// 获取所有备课夹
					getAllPrepare();
				}
				
				// 处理页面刷新 
				$scope.VM.isList = $localStorage.isPrepareList;
				if($scope.VM.isList) {
					$timeout(function(){
						$scope.closeCurrentVersion();
					})
				}
					
				
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentMaterialTmpShow = false;
				}
				
				$localStorage.isPrepareRefresh = true;
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
					$scope.listData[index].active = true;
				}

				// 监听 目录树 选择
				$scope.$on("currentTreeNodeChange", function(e, d) {
					getPrepare(d.tfcode);
				})

				// 读取备课夹 列表
				var preparePage = 1;
				$scope.preparePerPage = 10;
				$scope.VM.preparePageCtrl = 1;
				$scope.VM.preparePerPage = $scope.preparePerPage;
				// 分页触发
				$scope.pagePrepareChanged = function(pagenum) {
					preparePage = $scope.VM.preparePageCtrl;
					getPrepare($localStorage.currentTreeNode.tfcode);
				};
				
				var getPrepare = function(id) {
					Prepare.prepare_page({
						tfcode: id,
						page: preparePage,
						perPage: $scope.preparePerPage
					}, function(data) {
						$scope.listData = data.data.list;
						$scope.prepareData = data.data;
						$scope.bigPrepareTotalItems = data.data.totalLines;
						if (data.data && data.data.list.length > 0) {
							$scope.noPrepare = false;
							var paramsId = $stateParams.prepareId;
							if (paramsId) {
								_.each($scope.listData, function(v, i) {
									if (v.id == paramsId) v.active = true;
									else v.active = false;
								})
							} else $scope.listData[0].active = true;
							//获取备课夹详细内容
							_.each($scope.listData, function(v, i) {
								getPrepareDetails(v.id, i);
								v.editPrepareTitle = false;
							})
						}
						else {
							$scope.noPrepare = true;
						}
					})
				}

				// 读取 当前学科下的备课夹 列表
				var page = 1;
				$scope.perPage = 4;
				$scope.VM.perPage = $scope.perPage;
				$scope.maxSize = 3;
				// 一周内备课夹
				var getWithinWeekPrepare = function(){
					Prepare.prepare4book({
						termId: $localStorage.currentGrade.id,
						subjectId: $localStorage.currentSubject.id,
						timeLabel:'withinweek',
						page:page,
						perPage:$scope.perPage
					}, function(data) {
						$scope.withinWeekPrepare = data.data;
						$scope.bigWeekTotalItems = data.data.totalLines;
					})
				}
				// 一月内备课夹
				var getWithinMonthPrepare = function(){
					Prepare.prepare4book({
						termId: $localStorage.currentGrade.id,
						subjectId: $localStorage.currentSubject.id,
						timeLabel:'withinmonth',
						page:page,
						perPage:$scope.perPage
					}, function(data) {
						$scope.withinMonthPrepare = data.data;
						$scope.bigMonthTotalItems = data.data.totalLines;
					})
				}
				// 一周内备课夹
				var getMoreEarlyPrepare = function(){
					Prepare.prepare4book({
						termId: $localStorage.currentGrade.id,
						subjectId: $localStorage.currentSubject.id,
						timeLabel:'moreearly',
						page:page,
						perPage:$scope.perPage
					}, function(data) {
						$scope.moreEarlyPrepare = data.data;
						$scope.bigEarlyTotalItems = data.data.totalLines;
					})
				}
				//更早
				var getAllPrepare = function() {
					// 一周内备课夹
					getWithinWeekPrepare();
					// 一月内备课夹
					getWithinMonthPrepare();
					// 更早
					getMoreEarlyPrepare();
				}

				// 分页触发
				$scope.VM.weekPageCtrl = 1;
				$scope.VM.monthPageCtrl = 1;
				$scope.VM.earlyPageCtrl = 1;
				$scope.pageWeekChanged = function(pagenum) {
					page = $scope.VM.weekPageCtrl;
					getWithinWeekPrepare();
				};
				$scope.pageMonthChanged = function(pagenum) {
					page = $scope.VM.monthPageCtrl;
					getWithinMonthPrepare();
				};
				$scope.pageEarlyChanged = function(pagenum) {
					page = $scope.VM.earlyPageCtrl;
					getMoreEarlyPrepare();
				};

				//监听课本选择
				$scope.$on("currentTreeIdUpdate", function(e, tfcode) {
					// 更改目录标题
					$scope.currentVersion = $localStorage.currentVersion;
					// 对备课夹 搜索页 显示处理
					$scope.showSearchResults = false;
				})

				// 读取 单个备课夹详细内容
				var getPrepareDetails = function(id, index) {
					Prepare.prepareContent({
						id: id
					}, function(data) {
						$scope.listData[index].children = data.data;
						_.each(data.data, function(v, i) {
							v.isSelected = true;
							v.active = false;
						})
						if ($scope.listData[index].children && $scope.listData[index].children.length > 0) {
							$scope.listData[index].children[0].active = true;
						}
					})
				}

				//选中资源
				$scope.setItemActive = function(index, parentIndex) {
					if ($scope.listData[parentIndex].children && $scope.listData[parentIndex].children.length > 0) {
						_.each($scope.listData[parentIndex].children, function(v, i) {
							v.active = false;
						})
						$scope.listData[parentIndex].children[index].active = true;
					}
				}

				// 备课夹列表页跳转
				$scope.turnToPrepare = function(id) {
					$state.reload();
				}

				//编辑备课夹标题
				$scope.editPrepare = function(index) {
					$scope.listData[index].editPrepareTitle = true;
				}

				//设定备课夹名称
				$scope.setPrepareTitle = function(index) {
					Prepare.basePostApi({
						id: $scope.listData[index].id,
						title: $scope.listData[index].title,
						_method: "PATCH"
					}, function(data) {
						$scope.listData[index].title
					})
					$scope.listData[index].editPrepareTitle = false;
				}

				// 删除备课夹
				$scope.deletePrepare = function(index, e) {
					e.stopPropagation();
					var deleteModal = ModalMsg.confirm("确定删除备课夹：" + $scope.listData[index].title);

					deleteModal.result.then(function(data) {
						Prepare.basePostApi({
							id: $scope.listData[index].id,
							_method: "DELETE"
						}, function(data) {
							getPrepare($localStorage.currentTreeNode.tfcode);
						})
					})
				}

				// 删除备课夹
				$scope.deletePrepare2 = function(list, e) {
					e.stopPropagation();
					var deleteModal = ModalMsg.confirm("确定删除备课夹：" + list.title);

					deleteModal.result.then(function(data) {
						Prepare.basePostApi({
							id: list.id,
							_method: "DELETE"
						}, function(data) {
							getAllPrepare();
						})
					})
				}

				// 新建备课夹
				$scope.newPrepare = function() {

					var modalNewPrepare = $uibModal.open({
						templateUrl: "modal-prepare.html",
						controller: 'PrepareModalController',
						size: 'new-prepare'
					})

					//创建备课夹
					modalNewPrepare.result.then(function(data) {
						var title = data.name;
						var newTitle = data.name;
						Prepare.basePostApi({
							tfcode: data.node.tfcode,
							title: newTitle
						}, function(d) {
							$localStorage.currentTreeNode = data.node;
							window.location.reload();
						})
					});
				}

				//备课夹中内容操作——1.置底 2.上移 3.下移 4.置顶
				$scope.setItem = function(id, childindex, index, type) {
					var prevId = 0;
					var nextId = 0;
					var prevIndex = 0;
					var nextIndex = 0;
					var list = $scope.listData[index].children;
					var len = list.length;
					var msg = "";
					var successMsg = "";
					//置底
					if (type == 1) {
						prevId = id;
						nextId = list[len - 1].id;
						prevIndex = childindex;
						nextIndex = len - 1;
						if (prevId == nextId) {
							msg = "已是最后一条内容！";
						}
					}
					//上移
					else if (type == 2) {
						nextId = id;
						nextIndex = childindex;
						if (childindex == 0) {
							msg = "当前已是第一条!";
						} else {
							prevIndex = nextIndex - 1;
							prevId = list[prevIndex].id;
						}
					}
					//下移
					else if (type == 3) {
						prevId = id;
						prevIndex = childindex;
						if (prevIndex == len - 1) {
							msg = "当前已是最后一条!";
						} else {
							nextIndex = prevIndex + 1;
							nextId = list[nextIndex].id;
						}
					}
					//置顶
					else if (type == 4) {
						prevId = list[0].id;
						prevIndex = 0;
						nextIndex = childindex;
						if (childindex == 0) {
							msg = "当前已是第一条！";
						} else nextId = id;
					}

					if (msg.length == 0) {
						Prepare.prepareContentBaseApi({
							prevId: prevId,
							nextId: nextId,
							_method: "PATCH"
						}, function(data) {
							var tmpitem = $scope.listData[index].children[prevIndex];
							$scope.listData[index].children[prevIndex] = $scope.listData[index].children[nextIndex];
							$scope.listData[index].children[nextIndex] = tmpitem;
						})
					} else {
						ModalMsg.logger(msg);
					}
				}

				//备课夹中内容操作——删除，根据关联id
				$scope.deleteItem = function(id, title, prepareIndex) {
					var deleteModal = ModalMsg.confirm("确定从备课夹中删除资源：<br>"+ title);
					deleteModal.result.then(function(data) {
						Prepare.prepareContentBaseApi({
							ids: id,
							_method: "DELETE"
						}, function(data) {
							if (data.code == "OK") {
//								ModalMsg.logger("从备课夹删除资源成功！");
								getPrepareDetails($scope.listData[prepareIndex].id, prepareIndex);
							} else {
								ModalMsg.logger("从备课夹删除资源失败，请重试！");
							}
						})
					})
					
					
				}

				$scope.downLoadRes = function(id, flag, title) {
					Prepare.zipPrepare({
						ids: id,
						fromflags: flag,
						zipname: title
					}, function(data) {
						if (data.data) {
							ModalMsg.alert("正在打包中，请稍候...");
							var t = setInterval(function() {
								Res.getMyDownloadStatus({
									id: data.data
								}, function(data) {
									if (!!data.data.status) {
										clearInterval(t);
										openwin(data.data.zippath);
									}
								})
							}, 2000)
						}
					})
				}

				// 下载单个资源
				$scope.resDownloadByResId = function(id, flag) {
					Res.resDownload({
						resIds: id,
						fromFlags: flag
					}, function(data) {
						if (data.data)
							openwin(data.data[0].path)
					})
				}

				// 打包下载资源
				$scope.zipPrepare = function(id, flag) {
					//批量下载
					if (flag == -1) {
						var resIds = [];
						var flags = [];
						_.each(id.children, function(v, i) {
							if (v.isSelected) {
								resIds.push(v.resId);
								flags.push(v.fromFlag);
							}
						})
						if (resIds.length == 0) {
							ModalMsg.alert("当前备课夹下没有资源哦");
						} else $scope.downLoadRes(resIds.toString(), flags.toString(), id.title);
					}
					//单个资源下载a
					else {
						$scope.downLoadRes(id, flag);
					}
				}

				//下载资源
				$scope.zipPrepareList = function(id, title) {
					_.each($scope.listData, function(pre, i) {
						if (pre.id == id) {
							//批量下载
							var resIds = [];
							var flags = [];
							_.each(pre.children, function(v, i) {
								resIds.push(v.resId);
								flags.push(v.fromFlag);
							})
							if (resIds.length == 0) {
								ModalMsg.alert("当前备课夹下没有资源哦");
							} else $scope.downLoadRes(resIds.toString(), flags.toString(), title);
						}
					})
				}

				$scope.selectRes = function(item) {
					item.isSelected = !item.isSelected;
				}

				//搜索备课夹
				$scope.searchwords = "";
				$scope.searchList = [];
				$scope.showSearchResults = false;
				$scope.searchPrepare = function(searchwords) {
					if (searchwords != "") {
						Prepare.prepare4book({
							title: searchwords,
							termId: $localStorage.currentGrade.id,
							subjectId: $localStorage.currentSubject.id
						}, function(data) {
							$scope.showSearchResults = true;
							$scope.searchList = data.data.list;
						})
					}else {
//						ModalMsg.logger("搜索内容不能为空");
						$scope.showSearchResults = false;
					}
				}

				//编辑资源
				//0，系统资源，1自建资源，2共享资源,3校本资源,4区本资源 
				$scope.editRes = function(res) {
					var resToBeEdit = res;
					if (resToBeEdit.fromFlag != 1) {
						ModalMsg.alert("当前资源不允许编辑！");
					} else {
						// 获取资源详细信息
						Res.getResDetails({
							id: res.resId
						}, function(data) {
							var resDetails = data.data;
							var editResModal = $uibModal.open({
								templateUrl: "eiditResModal.html",
								windowClass: "upload-modal",
								controller: 'editResInstanceCtrl',
								resolve: {
									resitem: function() {
										return res;
									},
									resDetails: function() {
										return resDetails;
									}
								}
							})

							editResModal.result.then(function(data) {
								console.log(data);
							})
						})
					}

				}

				//移动文件 到-1 复制到-2
				$scope.opResTo = function(res, optype) {
//					if (optype == 2)
//						optype = "复制资源到备课夹";
					var movePrepareModal = $uibModal.open({
						templateUrl: "move-prepare.html",
						controller: 'selectPrepareCtrl',
						size: 'new-prepare',
						windowClass: "prepare-select-modal"
					})

					//移动到备课夹
					movePrepareModal.result.then(function(data) {
						//判断当前资源是否已经存在
						Prepare.prepareContent({
							id: data.prepareId
						}, function(items) {
							var resData = items.data;
							var hasTheRes = false;
							if (resData && resData.length > 0) {
								for (var i = 0; i < resData.length; i++) {
									if (resData[i].resId == res.resId) {
										hasTheRes = true;
										ModalMsg.alert("该资源已经存在，不能移动或复制！");
										break;
									}
								}
							}
							if (!hasTheRes) {
								Prepare.addResToPrepareId({
									id: data.prepareId,
									resIds: res.resId,
									fromFlags: res.fromFlag
								}, function(d) {
									if (d.code == "OK") {
										if (optype == 1) {
											// 删除当前 备课夹 当前资源
											Prepare.prepareContentBaseApi({
												ids: res.id,
												_method: "DELETE"
											}, function(data) {
												if (data.code == "OK") {
					//								ModalMsg.logger("从备课夹删除资源成功！");
													getPrepare($localStorage.currentTreeNode.tfcode);
												} else {
													ModalMsg.logger("从备课夹删除资源失败，请重试！");
												}
											})
										}else{
											getPrepare($localStorage.currentTreeNode.tfcode);
										}
										
									} else {
										ModalMsg.logger("操作失败，请重试！")
									}
								})
							}

						})
					});
				}

				// 备课夹移动到-1，复制到-2
				$scope.opPrepareTo = function(list, flag) {
					var opName = "复制到备课夹"
					if (flag == 1) opName = "移动到备课夹";

					var movePrepareModal = $uibModal.open({
						templateUrl: "modal-prepare-op.html",
						controller: 'opPrepareController',
						resolve: {
							opName: function() {
								return opName;
							}
						}
					})

					movePrepareModal.result.then(function(data) {
						//移动 复制
						if (flag == 1) {
							//移动 
							Prepare.prepareMove({
								prepareId: list.id,
								tfcode: data.tfcode,
							}, function(d) {
								if (d.code == "OK") {
									ModalMsg.logger("移动备课夹成功！")
								} else {
									ModalMsg.logger("移动备课夹失败，请重试！")
								}
							})
						}else{
							// 复制
							Prepare.prepareCopy({
								prepareId: list.id,
								tfcode: data.tfcode,
							}, function(d) {
								if (d.code == "OK") {
									ModalMsg.logger("复制备课夹成功！")
								} else {
									ModalMsg.logger("复制备课夹失败，请重试！")
								}
							})
						}
					})
				}

				//上传本地资源
				$scope.uploadRes = function(prepareId, index) {
					var modalNewUpload = $uibModal.open({
						templateUrl: "uploadModal.html",
						windowClass: "upload-modal",
						controller: 'uploadResController',
					})

					// 上传结束
					modalNewUpload.result.then(function(data) {
						// 更新上传 处理结果
						Prepare.addResToPrepareId({
							id: prepareId,
							resIds: data[0].id,
							fromFlags: 1
						}, function(d) {
							if (d.code == "OK") {
								getPrepareDetails(prepareId, index);
							} else {
								ModalMsg.logger("上传到备课夹失败，请重试！")
							}
						})

					});
				}

				//在线授课 isGet判断是否从整体书备课夹中来
				$scope.turnToClass = function(list, isGet) {
					if(isGet){
						// 获取备课夹内容，看是否为空
						Prepare.prepareContent({
							id: list.id
						}, function(data) {
							if(data.data.length > 0){
								openwin('onlineres/'+list.id);
							} else {
								ModalMsg.logger("当前备课夹下没有资源哦,请先添加备课资源~");
							}
						})
					} else if (list && list.children && list.children.length > 0) {
						$localStorage.currentPrepare = list;
						openwin('onlineres/'+list.id);
					} else {
						ModalMsg.logger("当前备课夹下没有资源哦,请先添加备课资源~");
					}
				}

				//资源预览
				$scope.previewRes = function(res) {
					if (res.fromFlag == 1) {
						// if(res.isFinished == 0) 
						
//						$state.go('previewres', {resId:res.resId,curTfcode:'',fromFlag:1,search:'prepare',type:'1'});
						var url = $state.href('previewres', {resId:res.resId,curTfcode:'',fromFlag:1,search:'prepare',type:'1'});
						openwin(url);
					} 
					else {
//						$state.go('previewres', {resId: res.resId,curTfcode: '',fromFlag: res.fromFlag,search: 'prepare'});
						var url = $state.href('previewres', {resId: res.resId,curTfcode: '',fromFlag: res.fromFlag,search: 'prepare'});
						openwin(url);
					}
				}
			}
		])

	.controller("PrepareModalController", ['$scope', '$stateParams', '$state', '$location', '$uibModalInstance', 'Prepare', 'ModalMsg', 'Tree', '$localStorage',
		function($scope, $stateParams, $state, $location, $uibModalInstance, Prepare, ModalMsg, Tree, $localStorage) {

			$scope.prepareOK = function() {
				if($scope.prepareName == "") {
					ModalMsg.alert("请输入备课夹名称！");
				}
				else {
					var tmpVal = {
						'node': $scope.currentNode,
						'name': $scope.prepareName
					}
					$uibModalInstance.close(tmpVal);
				}
			};

			$scope.prepareCancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

			// 监听目录树变化
			Tree.getTree({
				pnodeId: $localStorage.currentMaterial.id,
			}, function(data) {
				$scope.treedata = data.data;
				// 目录树全展开
				$scope.expandedNodes = window.allNodes;
				// 目录树节点选择
				getCurrentTreeNode();
			
			})
			
			var getCurrentTreeNode = function(){
				$scope.currentNode = $localStorage.currentTreeNode;
				$scope.prepareName = $scope.currentNode.label;
				var nodes =  $scope.currentNode.i.split('.');
				if (nodes.length == 1) {
					$scope.selected = $scope.treedata[nodes[0] - 1];	
				} else if (nodes.length == 2) {
					$scope.selected = $scope.treedata[nodes[0] - 1].children[nodes[1] - 1];
				} else if (nodes.length == 3) {
					$scope.selected = $scope.treedata[nodes[0] - 1].children[nodes[1] - 1].children[nodes[2] - 1];
				} else if (nodes.length == 4) {
					$scope.selected = $scope.treedata[nodes[0] - 1].children[nodes[1] - 1].children[nodes[2] - 1].children[nodes[3] - 1];
				} else if (nodes.length == 5) {
					$scope.selected = $scope.treedata[nodes[0] - 1].children[nodes[1] - 1].children[nodes[2] - 1].children[nodes[3] - 1].children[nodes[4] - 1];
				} else
					$scope.selected = $scope.treedata[0];
			}

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
				$scope.currentNode = sel;
				$scope.prepareName = $scope.currentNode.label;
			};
		}
	])

	.controller("opModalController", ['$scope', '$stateParams', '$state', '$location', '$uibModalInstance', 'Prepare', 'ModalMsg', 'Tree', '$localStorage',
		function($scope, $stateParams, $state, $location, $uibModalInstance, Prepare, ModalMsg, Tree, $localStorage) {
			$scope.moveOK = function() {
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
				$scope.treedataSelect = data.data;
				// 目录树全展开
				$scope.expandedNodes = window.allNodes;
				$scope.selected = $scope.treedataSelect[0];
				// 目录树节点选择
				$scope.currentNode = $scope.treedataSelect[0];
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
				$scope.prepares = data.data;
				//获取备课夹详细内容

			})
			$scope.showSelected = function(sel) {
				$scope.currentNode = sel;
				//获取当前节点下的所有备课夹
				Prepare.baseGetApi({
					tfcode: $scope.currentNode.tfcode
				}, function(data) {
					$scope.prepares = data.data;
					if ($scope.prepares.length == 0) {
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

	.controller("opPrepareController", ['$scope', '$stateParams', '$state', '$location', '$uibModalInstance', 'Prepare', 'ModalMsg', 'Tree', '$localStorage', 'opName',
		function($scope, $stateParams, $state, $location, $uibModalInstance, Prepare, ModalMsg, Tree, $localStorage, opName) {
			$scope.opName = opName

			$scope.prepareOK = function() {
				if (!$scope.currentNode.id) {
					ModalMsg.logger("还没选择目录节点哦");
					return;
				}
				var tmpVal = {
					'tfcode': $scope.currentNode.tfcode,
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
				$scope.treedataSelect = data.data;
				// 目录树全展开
				$scope.expandedNodes = window.allNodes;
				$scope.selected = $scope.treedataSelect[0];
				// 目录树节点选择
				$scope.currentNode = $scope.treedataSelect[0];
			})

			// 目录树节点选择
			$scope.showSelected = function(sel) {
				$scope.currentNode = sel;
			};

		}
	])
}());