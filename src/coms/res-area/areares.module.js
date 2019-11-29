/**
 * 系统资源 模块
 */
(function () {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.areares')
		.config(['$stateProvider',
			function ($stateProvider) {
				$stateProvider
					.state('areares', {
						url: '/areares',
						views: {
							'content@': {
								templateUrl: '/coms/layout/views/res/res-container.html',
								controller: 'AreaResController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header.html',
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
		.factory('AreaRes', ['$resource',
			function ($resource) {
				return $resource('', {}, {
					// 资源类型 
					types: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/districtResource/types"
					},
					// 查询 资源格式 
					formats: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/districtResource/formats"
					},
					//资源列表
					resList: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/districtResource"
					}
				})
			}
		])
		.controller("AreaResController", ['$scope', '$stateParams', '$state', '$location', 'AreaRes', 'Prepare', '$localStorage', 'ModalMsg', '$timeout', 'Res', '$interval', '$uibModal',
			function ($scope, $stateParams, $state, $location, AreaRes, Prepare, $localStorage, ModalMsg, $timeout, Res, $interval, $uibModal) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				// 无数据 时显示
				$scope.noDataCtrl = false;
				// 加载过程显示 转圈
				$scope.isLoading = true;
				// 下方控制栏不显示
				$scope.isLoadingFinish = false;
				// 关闭版本筛选
				$scope.closeCurrentVersion = function () {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentVersionTmpShow = false;

					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentMaterialTmpShow = false;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function () {
					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentMaterialTmpShow = false;
				}
				// list切换
				$scope.isList = $localStorage.resList == true ? $localStorage.resList : true;
				$scope.switchList = function (list) {
					$localStorage.resList = list
					$scope.isList = list;
				}
				// 设置 系统资源为0  校本是3 区本是4;
				$localStorage.fromFlag = 4;
				$scope.fromFlag = $localStorage.fromFlag;
				// 加入备课夹 计数
				//$scope.shopCount = 0;

				// 当前备课夹 
				var currentPrepareId = '';
				// 当前节点备课夹 列表
				var getPrepare = function (id) {
					//获取当前节点 备课夹
					Prepare.GetSelfPrepare({
						tfcode: id
					}, function (data) {
						// console.log("prepareTree:",data.data);
						$scope.prepareDataList = data.data;
						currentPrepareId = !!$scope.prepareDataList[0] ? $scope.prepareDataList[0].id : '';
					})
				}

				//获取 最近三个备课夹
				var getLatesPrepare = function (showModal) {
					Prepare.latestPrepare({}, function (data) {
						// console.log("prepare:",data.data);
						$scope.prepareList = data.data;
					})
				}

				setTimeout(function () {
					getLatesPrepare();
					getPrepare($localStorage.currentTreeNode ? $localStorage.currentTreeNode.tfcode : '');
				}, 1000);


				//将资源加入备课夹
				$scope.addToPrepare = function ($event, listIndex, prepareIndex) {
					$event.stopPropagation();
					// console.log(listIndex, prepareIndex)
					Prepare.addResToPrepareId({
						id: $scope.prepareList[prepareIndex].id,
						resIds: $scope.resList.list[listIndex].id,
						fromFlags: $localStorage.fromFlag
					}, function (data) {
						if (data.code == 'OK' || data.code == 'ok') {
							//加1
							//							$scope.shopCount++;
							// 动画显示
							ModalMsg.logger("成功加入收藏夹：" + $scope.prepareList[prepareIndex].title);
							addPrepareAnimation();

							currentPrepareId = $scope.prepareList[prepareIndex].id;

							getLatesPrepare(true);

						} else {
							ModalMsg.error(data);
						}
					})
				}

				//将资源加入当前备课夹，如果没有当前备课夹，创建节点同名备课夹
				$scope.addToCurrentPrepare = function (listIndex) {
					// 当前没有备课夹时，创建
					if ($scope.prepareDataList.length == 0) {

						Prepare.basePostApi({
							tfcode: $localStorage.currentTreeNode.tfcode,
							title: $localStorage.currentTreeNode.label
						}, function (d) {
							// 加入备课夹
							Prepare.addResToPrepareId({
								id: d.data.id,
								resIds: $scope.resList.list[listIndex].id,
								fromFlags: $localStorage.fromFlag
							}, function (data) {
								ModalMsg.logger("成功加入收藏夹：" + d.data.title);
								// 获取最近三个备课夹
								getLatesPrepare(true);
								// 获取当前节点备课夹
								getPrepare($localStorage.currentTreeNode.tfcode);
								//加1
								//								$scope.shopCount++;
								// 动画显示
								addPrepareAnimation();


							})

						})
					} else {
						Prepare.addResToPrepareId({
							id: $scope.prepareDataList[0].id,
							resIds: $scope.resList.list[listIndex].id,
							fromFlags: $localStorage.fromFlag
						}, function (data) {
							if (data.code == 'OK' || data.code == 'ok') {
								//加1
								ModalMsg.logger("成功加入收藏夹：" + $scope.prepareDataList[0].title);
								// 获取最近三个备课夹
								getLatesPrepare(true);
								// 动画显示
								addPrepareAnimation();

							} else {
								ModalMsg.error(data);
							}
						})
					}

				}

				// 全选 或 多选 加入 
				// 将选择资源加入当前备课夹，如果没有当前备课夹，创建节点同名备课夹
				$scope.addAllToPrepare = function ($event) {
					$event.stopPropagation();
					if (!$scope.resList.select || $scope.resList.select.length == 0) {
						ModalMsg.logger("您还没有选择资源哦");
						return;
					}
					// 当前没有备课夹时，创建
					if ($scope.prepareDataList.length == 0) {
						Prepare.basePostApi({
							tfcode: $localStorage.currentTreeNode.tfcode,
							title: $localStorage.currentTreeNode.label
						}, function (d) {
							// 加入备课夹
							//生成flags
							var flags = new Array($scope.resList.select.length);
							_.each(flags, function (v, i) {
								flags[i] = $localStorage.fromFlag
							})
							Prepare.addResToPrepareId({
								id: d.data.id,
								resIds: $scope.resList.select.toString(),
								fromFlags: flags.toString()
							}, function (data) {
								if (data.code == 'OK' || data.code == 'ok') {
									// 获取最近三个备课夹
									getLatesPrepare();
									// 获取当前节点备课夹
									getPrepare($localStorage.currentTreeNode.tfcode);
									//加$scope.shopCount.length
									//								$scope.shopCount += $scope.resList.select.length;
									ModalMsg.logger("批量加入成功");
									// 动画显示
									addPrepareAnimation();
								} else {
									ModalMsg.error(data);
								}
							})
						})
					} else {
						//生成flags
						var flags = new Array($scope.resList.select.length);
						_.each(flags, function (v, i) {
							flags[i] = $localStorage.fromFlag
						})
						Prepare.addResToPrepareId({
							id: $scope.prepareDataList[0].id,
							resIds: $scope.resList.select.toString(),
							fromFlags: flags.toString()
						}, function (data) {
							if (data.code == 'OK' || data.code == 'ok') {
								// 动画显示
								addPrepareAnimation();
								// 获取最近三个备课夹
								getLatesPrepare();

								ModalMsg.logger("批量加入成功");
							} else {
								ModalMsg.error(data);
							}
						})
					}
				}

				// 全选 加入最近备课夹
				$scope.addAllToLatestPrepare = function ($event, prepareIndex) {
					$event.stopPropagation();
					if (!$scope.resList.select) {
						ModalMsg.logger("您还没有选择资源哦");
						return;
					}
					//生成flags
					var flags = new Array($scope.resList.select.length);
					_.each(flags, function (v, i) {
						flags[i] = $localStorage.fromFlag
					})
					Prepare.addResToPrepareId({
						id: $scope.prepareList[prepareIndex].id,
						resIds: $scope.resList.select.toString(),
						fromFlags: flags.toString()
					}, function (data) {
						if (data.code == 'OK' || data.code == 'ok') {
							currentPrepareId = $scope.prepareList[prepareIndex].id;
							// 动画显示
							addPrepareAnimation();
							// 获取最近三个备课夹
							getLatesPrepare();

							ModalMsg.logger("批量加入成功");
						} else {
							ModalMsg.error(data);
						}
					})
				}

				// 选择备课夹
				$scope.selectPrepare = function (e, listIndex, all) {
					e.stopPropagation();
					if (!!all) {
						if (!$scope.resList.select) {
							ModalMsg.logger("您还没有选择资源哦");
							return;
						}
					}
					var optypeText = '选择收藏夹';
					var selectPrepareModal = $uibModal.open({
						templateUrl: "select-prepare.html",
						controller: 'selectPrepareCtrl',
						resolve: {
							optypeText: function () {
								return optypeText;
							}
						},
						windowClass: "prepare-select-modal"
					})

					//到备课夹
					selectPrepareModal.result.then(function (data) {
						// 批量加入 备课夹
						if (!!all) {
							//生成flags
							var flags = new Array($scope.resList.select.length);
							_.each(flags, function (v, i) {
								flags[i] = $localStorage.fromFlag
							})
							Prepare.addResToPrepareId({
								id: data.prepareId,
								resIds: $scope.resList.select.toString(),
								fromFlags: flags.toString()
							}, function (data) {
								if (data.code == 'OK' || data.code == 'ok') {
									// 动画显示
									addPrepareAnimation();
									// 获取最近三个备课夹
									getLatesPrepare();
									ModalMsg.logger("批量加入成功");
								} else {
									ModalMsg.error(data);
								}
							})
						} else {
							Prepare.addResToPrepareId({
								id: data.prepareId,
								resIds: $scope.resList.list[listIndex].id,
								fromFlags: $localStorage.fromFlag
							}, function (d) {
								if (d.code == "OK") {
									// 获取最近三个备课夹
									getLatesPrepare(true);
									// 获取当前节点备课夹
									getPrepare($localStorage.currentTreeNode.tfcode);
									// 动画显示
									ModalMsg.logger("成功加入收藏夹：" + data.name);
									addPrepareAnimation();
								}
								else {
									ModalMsg.logger("加入收藏夹失败，请重试！")
								}
							})
						}

					});
				}


				// 监听 目录树 选择
				$scope.$on("currentTreeNodeChange", function (e, d) {
					// 列出资源
					tmpCtrl = true;
					page = 1;
					$scope.VM.currentPageCtrl = 1;
					$scope.noTreeData = false;
					getResList(0, 0, 0, d);
					// 列出  资源类型和格式
					$scope.typeAndFormat(0, 0, d);
					// 更改目录标题
					$scope.currentVersion = $localStorage.currentVersion;
					$timeout(function () {
						getPrepare(d.tfcode)
					}, 200)
				})

				// 无资源时显示
				$scope.$on("noTreeDataChange", function (e, d) {
					$scope.noTreeData = true;
				})

				// 列出资源
				var page = 1;
				$scope.perPage = 9;
				$scope.VM.perPage = $scope.perPage;
				$scope.maxSize = 3;
				$scope.currentPage = 1;
				var getResList = function (poolContent, typeContent, formatContent, tree) {
					$scope.isLoading = true;
					$scope.resList = [];
					$scope.noDataCtrl = false;
					$scope.poolId = poolContent == 0 ? poolContent : $scope.poolId;
					mTypeId = typeContent == 0 ? typeContent : mTypeId;
					format = formatContent == 0 ? '全部' : format;
					AreaRes.resList({
						poolId: $scope.poolId,
						mTypeId: mTypeId,
						fileFormat: format,
						fromFlag: $scope.fromFlag,
						tfcode: tree ? tree.tfcode : $localStorage.currentTreeNode.tfcode,
						orderBy: $scope.orderBy,
						page: page,
						perPage: $scope.perPage
					}, function (data) {

						//初始化全选

						$scope.VM.checkAll = [];
						$scope.resList = data.data;
						$scope.isLoading = false;
						$scope.isLoadingFinish = true;
						if ($scope.resList.totalLines == 0) {
							$scope.noDataCtrl = true;
						}

						if (!!$scope.resList) {
							// 分页
							$scope.bigTotalItems = $scope.resList.totalLines;

							//当前课程节点
							$scope.curTfcode = $localStorage.currentMaterial.tfcode;

							// 动画
							setTimeout(function () {
								addToPrepareAnimation();
							}, 1000)
						}
					})
				}

				// 列出资源库
				Res.pools({}, function (data) {
					$scope.pools = data.data;
				})
				// 列出资源类型 和格式
				$scope.poolId = 0;
				var mTypeId = 0;
				var format = "全部";
				$scope.orderBy = 0;
				// 页面刷新时和点击目录树时  控制list 不加载 
				var tmpCtrl = true;
				$scope.typeAndFormat = function (poolId, typeId, tree) {
					// 设值
					$scope.poolId = poolId;
					$localStorage.poolId = poolId;
					format = "全部";
					// 设置当前选择
					$scope.poolsSelected = poolId;
					$scope.typeSelected = 0;
					$scope.formatSelected = 0;
					page = 1;
					$scope.VM.currentPageCtrl = 1;
					// 获取资源列表
					if (tmpCtrl) {
						tmpCtrl = false;
					} else {
						getResList(poolId, 0, 0);
					}
					var currentTfcode = $localStorage.currentTreeNode ? $localStorage.currentTreeNode.tfcode : '';
					AreaRes.types({
						poolId: $scope.poolId,
						pTfcode: tree ? tree.tfcode : currentTfcode,
						tfcode: tree ? tree.tfcode : currentTfcode,
						fromFlag: $scope.fromFlag
					}, function (data) {
						$scope.types = data.data;
						$localStorage.types = data.data[0];
						AreaRes.formats({
							poolId: $scope.poolId,
							pTfcode: tree ? tree.tfcode : currentTfcode,
							tfcode: tree ? tree.tfcode : currentTfcode,
							fromFlag: $scope.fromFlag,
							typeId: 0
						}, function (data) {
							$scope.formats = data.data;
							$localStorage.formats = data.data[0];
						})
					}, function (error) {
						// console.log(error)
					})
				}
				// 当前资源库 选择
				$scope.isPoolActive = function (item) {
					return $scope.poolsSelected === item;
				};
				$scope.isTypeActive = function (item) {
					return $scope.typeSelected === item;
				};
				$scope.isFormatActive = function (item) {
					return $scope.formatSelected === item;
				};

				// 列出资源格式
				$scope.listFormat = function (index) {
					mTypeId = $scope.types[index].id;
					$localStorage.types = $scope.types[index];
					$scope.typeSelected = mTypeId;
					page = 1;
					$scope.VM.currentPageCtrl = 1;
					format = "全部";
					getResList();
					AreaRes.formats({
						poolId: $scope.poolId,
						pTfcode: $localStorage.currentTreeNode.tfcode,
						tfcode: $localStorage.currentTreeNode.tfcode,
						fromFlag: $scope.fromFlag,
						typeId: mTypeId
					}, function (data) {
						$scope.formats = data.data;
						$localStorage.formats = data.data[0];
						$localStorage.formats = data.data;
					})

				}
				// 选择 格式
				$scope.filterFormat = function (i) {
					format = $scope.formats[i];
					$localStorage.formats = $scope.formats[i];
					$scope.formatSelected = i;
					page = 1;
					$scope.VM.currentPageCtrl = 1;
					getResList();
				}

				// 综合 排序 0 最多下载 1 最新发布2
				$localStorage.orderBy = $scope.orderBy;
				$scope.dataSortByType = function (type) {
					$scope.orderBy = type;
					$localStorage.orderBy = $scope.orderBy;
					page = 1;
					getResList();
				}

				// 初始化为全部
				$scope.typeAndFormat(0, 0);

				// 分页触发
				$scope.VM.currentPageCtrl = 1;
				// 用于资源推荐 页获取资源
				$localStorage.resCurrentPage = $scope.VM.currentPageCtrl;
				$scope.pageChanged = function (pagenum) {
					if (!!pagenum && pagenum.split('.').length > 1) {
						ModalMsg.logger("请输入正整数");
						return;
					}

					if (pagenum > 0 && pagenum <= Math.ceil($scope.resList.total)) {
						page = pagenum;
						$scope.VM.currentPageCtrl = pagenum;
						getResList();
					} else if (pagenum == undefined) {
						page = $scope.VM.currentPageCtrl;
						getResList();
					}
					else {
						ModalMsg.logger("请输入大于0，小于页码总数的正整数~");
					}
					$localStorage.resCurrentPage = $scope.VM.currentPageCtrl;
				};

				//转到
				$scope.pageTo = $scope.VM.currentPageCtrl;

				// 下载资源
				$scope.resDownload = function (list) {
					Res.resDownload({
						resIds: list.id,
						fromFlags: $localStorage.fromFlag
					}, function (data) {
						if (data.data) {
							openwin(data.data[0].path)
							list.dloadTimes++;
						}
					})
				}

				// 每页显示条数
				$scope.changPerPage = function () {
					if ($scope.VM.perPage > 0 && $scope.VM.perPage < 100) {
						$scope.perPage = $scope.VM.perPage;
						page = 1;
						getResList();
					} else {
						ModalMsg.logger("请输入0-最大页数之间的正整数");
					}
				}
				// 选择 资源，用于加入备课夹
				$scope.perpareArray = []
				$scope.addItemSelect = function (resId) {
					var index = _.indexOf($scope.perpareArray, resId);
					// 清除全选
					$scope.VM.checkAll = [];
				}

				// 全选
				$scope.resList = {
					seletct: []
				};

				$scope.checkAll = function () {
					if (($scope.VM.checkAll)) {
						$scope.resList.select = $scope.resList.list.map(function (item) { return item.id; });
					} else {
						$scope.resList.select = [];
					}
				}

				// 打包下载
				var resZipDownload = function (ids, flags) {
					ModalMsg.alert("正在打包中，请稍候...");
					Res.resZIpDownload({
						ids: ids,
						fromflags: flags,
						zipname: $localStorage.currentTreeNode.label + '_打包文件'
					}, function (data) {
						if (data.data) {
							var t = setInterval(function () {
								Res.getMyDownloadStatus({
									id: data.data
								}, function (data) {
									if (!!data.data.status) {
										clearInterval(t);
										// 打包完成后提示
										zipDownloadTips(data.data.zippath);
									}
								})
							}, 2000)
						}
					})
				}

				// 打包下载 选择
				$scope.downLoadSelect = function () {
					if (!!$scope.resList.select) {
						//生成flags
						var flags = new Array($scope.resList.select.length);
						_.each(flags, function (v, i) {
							flags[i] = $localStorage.fromFlag
						})
						// 下载
						resZipDownload($scope.resList.select.toString(), flags.toString());
					} else {
						ModalMsg.logger("还没有选中资源哦");
					}
				}
			}
		])
}());