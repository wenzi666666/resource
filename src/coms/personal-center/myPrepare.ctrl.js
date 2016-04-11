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
				//上次被点中的li
				var lastActive = 0;
				//我的备课 列表
				Res.getPrepareResource({
					unifyTypeId: '0',
					fileFormat: '全部',
					page: 1,
					perPage: 10
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
					$scope.currentPage = 1;
				})
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
						$scope.currentPage = 1;
					})
				}
			}
		])
}());
