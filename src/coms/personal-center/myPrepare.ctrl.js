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

				$scope.getMyPrepare = function(pagenum, perpagenum) {
					var page = 1;
					var perpage = 10;
					if(pagenum == undefined) page = 1;
					else page = pagenum;
					if(perpagenum != undefined) perpage = perpagenum;
					Res.getPrepareResource({
						unifyTypeId: '0',
						fileFormat: '全部',
						page: page,
						perPage: perpage
					}, function(data) {
						console.log(data.data);
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
						$scope.VM.currentPage = 1;
					})
				}

				$scope.getMyPrepare();
				
				$scope.resTypes = [];	
				Personal.getResType({}, function(data) {
					$scope.resTypes = data.data;
					console.log(data.data);
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
					console.log(type);
					var typeObj = JSON.parse(type);
					console.log(typeObj.id);
					Res.getPrepareResource({
						unifyTypeId: typeObj.id,
						fileFormat: '全部',
						page: 1,
						perPage: 10
					}, function(data) {
						$scope.prepareList = data.data.list;
						console.log(data);
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
					if(pagenum == undefined) {
						$scope.getMyPrepare();
					}
					else if(pagenum > $scope.VM.totalPages) {
						ModalMsg.confirm("您要跳转的页数超出范围！");
					}
					else {
						$scope.VM.currentPage = pagenum;
						$scope.getMyPrepare($scope.VM.currentPage);
					}
				}

				$scope.changPerPage = function() {
					$scope.VM.currentPage = 1;
					$scope.getMyPrepare(1, $scope.VM.perPage);
				}
			}
		])
}());
