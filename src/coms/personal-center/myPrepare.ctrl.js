/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myPrepareCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage','ModalMsg','Res', 'Personal',
			function($scope, $stateParams, $state, $location, $localStorage,ModalMsg,Res,Personal) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				$scope.VM = {};
				$scope.VM.currentPage = 1;
				$scope.VM.perPage = 10;
				$scope.VM.totalPages = 1;
				//上次被点中的li
				var lastActive = 0;
				//我的备课 列表
				$scope.getMyPrepare = function() {
					Res.getPrepareResource({
						unifyTypeId: '0',
						fileFormat: '全部',
						page: $scope.VM.currentPage,
						perPage: $scope.VM.perPage
					}, function(data) {
						$scope.prepareList = data.data.list;
						lastActive = 0;
						if($scope.prepareList && $scope.prepareList.length > 0) {
							_.each($scope.prepareList, function(v, i) {
								v.active = false;
							})
							$scope.prepareList[lastActive].active = true;
						}
						$scope.totalItems = data.data.totalLines;
						$scope.VM.totalPages = data.data.total;
						$scope.total = data.data.total;
					})
				}

				$scope.getMyPrepare();
				
				//获取资源类型
				Personal.getResType({
					tabCode: "myPrepareRes"
				}, function(data) {
					$scope.resTypes = data.data;
					$scope.VM.resType = $scope.resTypes[0].mtype; 				
				})

				$scope.setResActive = function(index) {
					$scope.prepareList[lastActive].active = false;
					lastActive = index;
					$scope.prepareList[index].active = true;
				}

				$scope.tpSelected = {
					"id":0,
					"mtype":"全部",
					"code":"all"
				};
							//按type筛选资源
				$scope.selectResType = function(type) {
					$scope.VM.resType = type.mtype;
					Res.getPrepareResource({
						unifyTypeId: type.id,
						fileFormat: '全部',
						page: 1,
						perPage: $scope.VM.perPage
					}, function(data) {
						$scope.prepareList = data.data.list;
						lastActive = 0;
						if($scope.prepareList && $scope.prepareList.length > 0) {
							_.each($scope.prepareList, function(v, i) {
								v.active = false;
							})
							$scope.prepareList[lastActive].active = true;
						}
						$scope.totalItems = data.data.totalLines;
						$scope.VM.currentPage = 1;
					})
				}

				//分页
				$scope.pageTo = 1;
				$scope.pageChanged = function(pagenum) {
					if(!!pagenum &&pagenum.split('.').length > 1){
						ModalMsg.logger("请输入正整数");
						return;
					}
					if(pagenum == undefined) {
						$scope.getMyPrepare();
					}
					else if(pagenum > 0 && pagenum <= $scope.total){
						$scope.VM.currentPage = pagenum;
						$scope.getMyPrepare();
					}else {
						ModalMsg.logger("请输入大于0，小于页码总数的正整数~");
					} 
				}

				$scope.changPerPage = function(page) {
					$scope.VM.perPage = page;
					$scope.VM.currentPage = 1;
					$scope.getMyPrepare();
				}
			}
		])
}());
