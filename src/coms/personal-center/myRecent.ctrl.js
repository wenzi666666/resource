/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myRecentCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage','ModalMsg','Personal',
			function($scope, $stateParams, $state, $location, $localStorage,ModalMsg,Personal) {
				// 用户信息
				$scope.user = $localStorage.authUser;

				$scope.VM = {};
				$scope.VM.currentPage = 1;
				$scope.VM.perPage = 10;


				//获取资源类型
				Personal.getResType({
					tabCode: "myView"
				}, function(data) {
					$scope.resTypes = data.data;	
					$scope.VM.resType = $scope.resTypes[0].mtype; 			
				})
				
				

				$scope.getRecent = function() {
					// 下载资源 列表
					Personal.getRecentView({
						unifyTypeId: '0',
						page: $scope.VM.currentPage,
						perPage: $scope.VM.perPage
					}, function(data) {
						console.log("recentList:", data.data)
						$scope.VM.recentFileList = data.data;
						$scope.totalItems = data.data.totalLines;
					})
				}

				$scope.getRecent();

				$scope.changPerPage = function() {
					$scope.VM.currentPage = 1;
					$scope.getRecent();
				}

				//分页
				$scope.pageTo = 1;
				$scope.pageChanged = function(pagenum) {
					console.log($scope.VM.currentPage);
					if(pagenum == undefined) {
						$scope.getRecent();
					}
					else {
						$scope.VM.currentPage = pagenum;
						$scope.getRecent();
					}
				}
				
			}
		])
}());