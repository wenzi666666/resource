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
				$scope.isList = true;
			    $scope.switchList = function(list){
			    	$scope.isList = list;
			    }
			    // 设置 系统资源为0;
			    $localStorage.fromFlag = 0;
				// 加入备课夹 动画
				$scope.shopCount = 0;
				setTimeout(function() {
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
//								$("#msg").show().animate({width: '250px'}, 200).fadeOut(1000);
//								addcar.css("cursor","default").removeClass('orange').unbind('click');
								$('.u-flyer').remove(); //移除dom
								
								//加1
								$scope.$apply(function() {
									$scope.shopCount++;
								})
							}
						});
					});
				}, 3000)
				
				
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
					getPrepare($localStorage.currentTreeNode.tfcode)
				}, 3000)
				
				//将资源加入备课夹
				$scope.addToPrepare = function(index) {
					Prepare.addResToPrepareId({
						id: $scope.prepareList[index].id,
						resIds: '4319500105',
						fromFlags: 0
					}, function(data) {
						console.log(data);
						ModalMsg.alert("加入备课夹成功！")
						
					})
				}
				
				// 监听 目录树 选择
				$scope.$on("currentTreeNodeChange", function(e, d) {
					getResList();
				})
				
				// 列出资源
				var page =1;
				var perPage =8;
				$scope.maxSize = 3;
				$scope.currentPage = 1;
				var getResList = function() {
					SystemRes.resList({
						poolId: poolId,
						mTypeId: mTypeId,
						fileFormat: format,
						tfcode: $localStorage.currentTreeNode.tfcode,
						orderBy:$scope.orderBy,
						page:page,
						perPage: perPage
					}, function(data) {
						$scope.resList = data.data;
						console.log("resList:", $scope.resList)
						// 分页
						$scope.bigTotalItems = $scope.resList.totalLines;
						
						//当前课程节点
						$scope.curTfcode = $localStorage.currentMaterial.tfcode;
						
					})
				}
				
				// 列出资源库
				SystemRes.pools({}, function(data) {
					$scope.pools =data.data;
				})
				// 列出资源类型 和格式
				var poolId = 0;
				var mTypeId = 0;
				var format = "全部";
				$scope.orderBy = 0;
				$scope.typeAndFormat = function(poolId, typeId){
					// 设值
					poolId = poolId;
					format = "全部";
					// 设置当前选择
					$scope.poolsSelected = poolId;
					$scope.typeSelected =0;
					$scope.formatSelected =0;
					// 获取资源列表
					getResList();
					SystemRes.types({
						poolId: poolId,
						tfcode:$localStorage.currentTreeNode.tfcode
					}, function(data) {
						$scope.types =data.data;
						console.log("types:",data.data);
						SystemRes.formats({
							poolId: poolId,
							tfcode:$localStorage.currentTreeNode.tfcode,
							typeId: typeId
						}, function(data) {
							$scope.formats =data.data;
						})
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
					SystemRes.formats({
						poolId: poolId,
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
				// 初始化为全部
				$scope.typeAndFormat(0, 0);	
			}
		])
}());