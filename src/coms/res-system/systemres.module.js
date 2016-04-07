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
								templateUrl: '/coms/layout/footer/footer.html'
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
					}
				})
			}
		])
		.controller("SystemResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes','Prepare','$localStorage','ModalMsg',
			function($scope, $stateParams, $state, $location,SystemRes,Prepare,$localStorage,ModalMsg) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				// 关闭版本筛选
				$scope.closeCurrentVersion = function() {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
				}
				// list切换
				$scope.isList = $localStorage.resList?$localStorage.resList:true;
			    $scope.switchList = function(list){
			    	$localStorage.resList = list
			    	$scope.isList = list;
			    }
			    // 设置 系统资源为0;
			    $localStorage.fromFlag = 0;
				// 加入备课夹 动画
				$scope.shopCount = 0;
				
				// 加入备课夹 动画
				var addToPrepareAnimation = function(){
					
					$(".addPrepare").click(function(event){
						
						var addcar = $(this);
						var offset = $(".prepare-fixed").offset();
						var img = addcar.parent().parent().find('.res-list-thumb');
						var flyer = $('<img class="u-flyer" style="max-width:150px" src="'+img.attr('src')+'">');
						flyer.fly({
							start: {
								left: img.offset().left,
								top:  event.clientY-30
							},
							end: {
								left: offset.left+10,
								top: document.documentElement.clientHeight - 380,
								width: 0,
								height: 0
							},
							onEnd: function(){
								$('.u-flyer').remove(); //移除dom
							}
						});
					});
				}
			
				
				
				// 读取备课夹 列表
				var getPrepare = function(id) {
					Prepare.baseGetApi({
						tfcode: id
					}, function(data) {
						console.log(data.data);
						$scope.prepareList = data.data;
						
					})
				}
				setTimeout(function(){
					getPrepare($localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:'')
				}, 1000)
				
				//将资源加入备课夹
				$scope.addToPrepare = function(listIndex, prepareIndex) {
					console.log(listIndex, prepareIndex)
					Prepare.addResToPrepareId({
						id: $scope.prepareList[prepareIndex].id,
						resIds: $scope.resList.list[listIndex].id,
						fromFlags: $localStorage.fromFlag
					}, function(data) {
						//加1
						$scope.shopCount++;

					})
				}
				
				// 监听 目录树 选择
				$scope.$on("currentTreeNodeChange", function(e, d) {
					console.log("test")
					getResList();
				})
				
//				$scope.$on("currentTreeIdUpdate",function(e, d) {
//					console.log("test")
//				})
				
				// 列出资源
				var page =1;
				$scope.perPage =8;
				$scope.maxSize = 3;
				$scope.currentPage = 1;
				var getResList = function() {
					SystemRes.resList({
						poolId: $scope.poolId,
						mTypeId: mTypeId,
						fileFormat: format,
						tfcode: $localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:'',
						orderBy:$scope.orderBy,
						page:page,
						perPage: $scope.perPage
					}, function(data) {
						$scope.resList = data.data;
						console.log("resList:", $scope.resList)
						// 分页
						$scope.bigTotalItems = $scope.resList.totalLines;
						
						//当前课程节点
						$scope.curTfcode = $localStorage.currentMaterial.tfcode;
						
						// 动画
						setTimeout(function(){
							addToPrepareAnimation();
						},1000)
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
					getResList();
					SystemRes.types({
						poolId: $scope.poolId,
						tfcode:$localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:''
					}, function(data) {
						$scope.types =data.data;
						console.log("types:",data.data);
						SystemRes.formats({
							poolId: $scope.poolId,
							tfcode:$localStorage.currentTreeNode?$localStorage.currentTreeNode.tfcode:'',
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
						tfcode: $localStorage.currentTreeNode.tfcode,
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
				$scope.dataSortByType = function(type){
					$scope.orderBy = type;
					page = 1;
					getResList();
					
				}
				
				// 初始化为全部
				$scope.typeAndFormat(0, 0);
				
				// 分页触发
				$scope.VM.currentPageCtrl = 1;
				$scope.pageChanged = function() {
				    console.log('Page changed to: ' + $scope.VM.currentPageCtrl);
				    page = $scope.VM.currentPageCtrl;
				    getResList();
				};
				
				// 下载资源
				$scope.resDownload = function(id){
					SystemRes.resDownload({
						resId:id,
						fromFlag: $localStorage.fromFlag
					}, function(data){
						console.log(data)
					})
				}
			}
		])
}());