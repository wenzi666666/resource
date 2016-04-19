/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.systemres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('systemres', {
						url: '/systemres',
						views: {
							'content@': {
								templateUrl: '/coms/res-system/views/systemres.html',
								controller: 'SystemResController'
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
		.factory('SystemRes', ['$resource',
			function($resource) {
				return $resource('', {}, {
					// 查询资源库
					pools: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/pools"
					},
					// 系统资源类型 
					types: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/sysResource/types"
					},
					// 查询 系统资源格式 
					formats: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/sysResource/formats"
					},
					//资源列表
					resList: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/sysResource"
					},
					// 点击下载
					resDownload: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/res_down"
					},
					//打包下载
					resZIpDownload: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/prepareZip"
					}
				})
			}
		])
		.controller("SystemResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes','Prepare','$localStorage','ModalMsg','$timeout','Res','$interval','$uibModal',
			function($scope, $stateParams, $state, $location,SystemRes,Prepare,$localStorage,ModalMsg,$timeout,Res,$interval,$uibModal) {
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
				$scope.closeCurrentVersion = function() {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentVersionTmpShow = false;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
					$scope.VM.currentMaterialTmpShow = false;
				}
				// list切换
				$scope.isList = $localStorage.resList==true?$localStorage.resList:false;
				console.log($scope.isList)
			    $scope.switchList = function(list){
			    	$localStorage.resList = list
			    	$scope.isList = list;
			    }
			    // 设置 系统资源为0;
			    $localStorage.fromFlag = 0;
				// 加入备课夹 动画
				$scope.shopCount = 0;
				
				// 上传
				$scope.uploadRes = function() {
					var modalNewUpload = $uibModal.open({
						templateUrl: "uploadModal.html",
						windowClass: "upload-modal",
						controller: 'uploadResController',
					})

					// 上传结束
					modalNewUpload.result.then(function(data) {
						// 更新上传列表
						$scope.$broadcast('myUploadChange', data);
					});
				}

				// 读取备课夹 列表
				var currentPrepareId = '';
				var getPrepare = function(id) {
					//获取当前节点 备课夹
					Prepare.baseGetApi({
						tfcode: id
					}, function(data){
						console.log("prepareTree:",data.data);
						$scope.prepareDataList = data.data;
						currentPrepareId = !!$scope.prepareDataList[0]?$scope.prepareDataList[0].id:'';
					})
					
					//获取 最近三个备课夹
					Prepare.latestPrepare({}, function(data) {
						console.log("prepare:",data.data);
						$scope.prepareList = data.data;
					})
				}
				setTimeout(function(){
					getPrepare($localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:'')
				}, 1000)
				
				//将资源加入备课夹
				$scope.addToPrepare = function($event,listIndex, prepareIndex) {
					$event.stopPropagation();
					console.log(listIndex, prepareIndex)
					Prepare.addResToPrepareId({
						id: $scope.prepareList[prepareIndex].id,
						resIds: $scope.resList.list[listIndex].id,
						fromFlags: $localStorage.fromFlag
					}, function(data) {
						//加1
						$scope.shopCount++;
						
						currentPrepareId = $scope.prepareList[prepareIndex].id;

					})
				}
				
				//将资源加入当前备课夹，如果没有当前备课夹，创建节点同名备课夹
				$scope.addToCurrentPrepare = function(listIndex) {
					// 当前没有备课夹时，创建
					if($scope.prepareDataList.length == 0) {
						Prepare.basePostApi({
							tfcode: $localStorage.currentTreeNode.tfcode,
							title: $localStorage.currentTreeNode.label
						}, function(d) {
							// 获取备课夹
							getPrepare($localStorage.currentTreeNode.tfcode);
							// 加入备课夹
							Prepare.addResToPrepareId({
								id: d.data.id,
								resIds: $scope.resList.list[listIndex].id,
								fromFlags: $localStorage.fromFlag
							}, function(data) {
								//加1
								$scope.shopCount++;
							})
						})
					}else{
						Prepare.addResToPrepareId({
							id: currentPrepareId,
							resIds: $scope.resList.list[listIndex].id,
							fromFlags: $localStorage.fromFlag
						}, function(data) {
							//加1
							$scope.shopCount++;
	
						})
					}
					
				}
				
				// 全选 或 多选 加入 
				// 将选择资源加入当前备课夹，如果没有当前备课夹，创建节点同名备课夹
				$scope.addAllToPrepare = function($event,prepareIndex) {
					$event.stopPropagation();
					console.log($scope.resList.select)
					if(!$scope.resList.select){
						ModalMsg.logger("您还没有选择资源哦");
						return;
					}
					// 当前没有备课夹时，创建
					if($scope.prepareDataList.length == 0) {
						Prepare.basePostApi({
							tfcode: $localStorage.currentTreeNode.tfcode,
							title: $localStorage.currentTreeNode.label
						}, function(d) {
							// 获取备课夹
							getPrepare($localStorage.currentTreeNode.tfcode);
							// 加入备课夹
							//生成flags
							var flags = new Array($scope.resList.select.length);
							_.each(flags,function(v,i) {
								flags[i] = $localStorage.fromFlag
							})
							Prepare.addResToPrepareId({
								id: d.data.id,
								resIds: $scope.resList.select.toString(),
								fromFlags: flags.toString()
							}, function(data) {
								//加$scope.shopCount.length
								$scope.shopCount += $scope.resList.select.length;
							})
						})
					}else{
						//生成flags
						var flags = new Array($scope.resList.select.length);
						_.each(flags,function(v,i) {
							flags[i] = $localStorage.fromFlag
						})
						Prepare.addResToPrepareId({
							id: prepareIndex?prepareIndex:currentPrepareId,
							resIds: $scope.resList.select.toString(),
							fromFlags: flags.toString()
						}, function(data) {
							//加$scope.shopCount.length
							$scope.shopCount += $scope.resList.select.length;
	
						})
					}
				}
				
				// 新建备课夹
				$scope.VM.newPrepare = "新建备课夹";
				$scope.$watch('VM.newPrepare', function(newVal, oldVal) {
					console.log(newVal,oldVal)
				    if (newVal !== oldVal && newVal != "新建备课夹") {
				    	console.log(newVal,oldVal)
						Prepare.basePostApi({
							tfcode: $localStorage.currentTreeNode.tfcode,
							title: $scope.VM.newPrepare
						}, function(d) {
							$scope.VM.newPrepare = "新建备课夹"
							getPrepare($localStorage.currentTreeNode.tfcode);
						})
				    }
				 });
				 
				
				// 监听 目录树 选择
				$scope.$on("currentTreeNodeChange", function(e, d) {
					console.log("received:",d)
					getResList(d);
					// 更改目录标题
					$scope.currentVersion = $localStorage.currentVersion;
					$timeout(function(){
						getPrepare($localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:'')
					},300)
				})
				
				// 列出资源
				var page =1;
				$scope.perPage =9;
				$scope.VM.perPage = $scope.perPage;
				$scope.maxSize = 3;
				$scope.currentPage = 1;
				var getResList = function(d) {
					$scope.isLoading = true;
					SystemRes.resList({
						poolId: $scope.poolId,
						mTypeId: mTypeId,
						fileFormat: format,
						tfcode: d?d.tfcode:$localStorage.currentTreeNode.tfcode,
						orderBy:$scope.orderBy,
						page:page,
						perPage: $scope.perPage
					}, function(data) {
						
						//初始化全选
//						_.each(data.data.list, function(v, i) {
//							data.data.list[i].select = false;
//						})
						$scope.resList = data.data;
						// console.log("resList:", $scope.resList)
						
						$scope.noDataCtrl = false;
						$scope.isLoading = false;
						$scope.isLoadingFinish = true;
						if(!$scope.resList || !$scope.resList.totalLines){
							$scope.noDataCtrl = true;
						}
						
						if(!!$scope.resList){
							// 分页
							$scope.bigTotalItems = $scope.resList.totalLines;
							
							//当前课程节点
							$scope.curTfcode = $localStorage.currentMaterial.tfcode;
							
							// 动画
							setTimeout(function(){
								addToPrepareAnimation();
							},1000)
						}
					})
				}
				
				// 列出资源库
				SystemRes.pools({}, function(data) {
					$scope.pools =data.data;
				})
				// 列出资源类型 和格式
				$scope.poolId = 0;
				var mTypeId = 0;
				var format = "全部";
				$scope.orderBy = 0;
				// 页面刷新时 控制list 不加载
				var tmpCtrl = true;
				$scope.typeAndFormat = function(poolId, typeId){
					// 设值
					$scope.poolId = poolId;
					console.log("typeAndFormat:", poolId)
					format = "全部";
					// 设置当前选择
					$scope.poolsSelected = poolId;
					$scope.typeSelected =0;
					$scope.formatSelected =0;
					// 获取资源列表
					if(tmpCtrl){
						tmpCtrl = false;
					}else{
						getResList();	
					}
					
					SystemRes.types({
						poolId: $scope.poolId,
						pTfcode:$localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:''
					}, function(data) {
						$scope.types =data.data;
						console.log("types:",data.data);
						SystemRes.formats({
							poolId: $scope.poolId,
							pTfcode:$localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:'',
							typeId: typeId
						}, function(data) {
							$scope.formats =data.data;
						})
					}, function(error) {
						console.log(error)
					})
				}
				// 当前资源库 选择
				$scope.isPoolActive = function(item) {
			        return $scope.poolsSelected === item;
			 	};
			 	$scope.isTypeActive = function(item) {
			        return $scope.typeSelected === item;
			 	};
			 	$scope.isFormatActive = function(item) {
			        return $scope.formatSelected === item;
			 	};
			 	
				// 列出资源格式
				$scope.listFormat = function(index) {
					mTypeId = $scope.types[index].id;
					$scope.typeSelected = mTypeId;
					format = "全部";
					getResList();
					SystemRes.formats({
						poolId: $scope.poolId,
						pTfcode: $localStorage.currentTreeNode.tfcode,
						typeId: mTypeId
					}, function(data) {
						$scope.formats = data.data;
					})
					
				}
				// 选择 格式
				$scope.filterFormat = function(i) {
					format = $scope.formats[i];
					$scope.formatSelected = i;
					getResList();
				}
				
				// 综合 排序 0 最多下载 1 最新发布2
				$localStorage.orderBy=$scope.orderBy;
				$scope.dataSortByType = function(type){
					$scope.orderBy = type;
					$localStorage.orderBy=$scope.orderBy;
					page = 1;
					getResList();
				}
				
				// 初始化为全部
				$scope.typeAndFormat(0, 0);
				
				// 分页触发
				$scope.VM.currentPageCtrl = 1;
				$scope.pageChanged = function(pagenum) {
					console.log(pagenum);
					if(pagenum == undefined) {
						console.log('Page changed to: ' + $scope.VM.currentPageCtrl);
					    page = $scope.VM.currentPageCtrl;
					    getResList();
					}
					else {
						page = pagenum;
						console.log('Page changed to: ' + page);
						$scope.VM.currentPageCtrl = pagenum;
					    getResList();
					   
					} 
				};

				//转到
				$scope.pageTo = $scope.VM.currentPageCtrl;
				
				// 下载资源
				$scope.resDownload = function(id){
					SystemRes.resDownload({
						resIds:id,
						fromFlags: $localStorage.fromFlag
					}, function(data){
						if(data.data)
							openwin(data.data[0].path)
					})
				}
				
				// 每页显示条数
				$scope.changPerPage = function() {
					if($scope.VM.perPage>0 && $scope.VM.perPage<100) {
						$scope.perPage = $scope.VM.perPage;
						page = 1;
						getResList();
					}else{
						ModalMsg.logger("请输入0-100之间的正整数");
					}
				}
				// 选择 资源，用于加入备课夹
				$scope.perpareArray = []
				$scope.addItemSelect = function(resId) {
					var index = _.indexOf($scope.perpareArray, resId);
					// 清除全选
					$scope.VM.checkAll = [];
				}
				
				// 全选
				$scope.resList = {
					seletct: []
				};
				
				$scope.checkAll =  function() {
					if(($scope.VM.checkAll)) {
						$scope.resList.select = $scope.resList.list.map(function(item) { return item.id; });
						console.log($scope.resList.select);
					}else{
						$scope.resList.select = [];
					}
				}
				
				// 打包下载
				var resZipDownload = function(ids,flags){
					SystemRes.resZIpDownload({
						ids:ids,
						fromflags: flags
					}, function(data){
						if(data.data) {
							console.log(data.data);
							ModalMsg.alert("正在打包中，请稍候...");
							var t = setInterval(function() {
								console.log("tt")
								Res.getMyDownloadStatus({
									id: data.data
								}, function(data) {
									if(!!data.data.status) {
										clearInterval(t);
										openwin(data.data.zippath);
										
									}
								})
							}, 2000)
						}
					})
				}
				
				$scope.downLoadSelect = function() {
					// 打包下载
					if(!!$scope.resList.select) {
						//生成flags
						var flags = new Array($scope.resList.select.length);
						_.each(flags,function(v,i) {
							flags[i] = $localStorage.fromFlag
						})
						// 下载
						resZipDownload($scope.resList.select.toString(),flags.toString());
					} else {
						ModalMsg.logger("还没有选中资源哦");
					}
				}
				
				// 选择备课夹
				$scope.selectPrepare = function(e,listIndex) {
					e.stopPropagation();
					var selectPrepareModal = $uibModal.open({
						templateUrl: "select-prepare.html",
						controller: 'selectPrepareCtrl',
					})

					//到备课夹
					selectPrepareModal.result.then(function(data) {
						Prepare.addResToPrepareId({
							id: data.prepareId,
							resIds: $scope.resList.list[listIndex].id,
							fromFlags: $localStorage.fromFlag
						}, function(d) {
							if(d.code == "OK") {
								getPrepare($localStorage.currentTreeNode.tfcode);
							}
							else {
								ModalMsg.logger("加入备课夹失败，请重试！")
							}
						})
					});
				}
			}
		])
}());