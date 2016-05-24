/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myDownloadCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage','ModalMsg','Personal',
			function($scope, $stateParams, $state, $location, $localStorage,ModalMsg,Personal) {
				// 用户信息
				$scope.user = $localStorage.authUser;

				$scope.VM = {};
				$scope.VM.currentPage = 1;
				$scope.VM.perPage = 10;


				//获取资源类型
				Personal.getResType({
					tabCode: "myDownload"
				}, function(data) {
					$scope.resTypes = data.data;
					$scope.VM.resType = $scope.resTypes[0].mtype; 				
				})
				
				

				$scope.getDownload = function(type) {
					// 下载资源 列表
					var typeId = 0;
					if(type) typeId = type.id;
					Personal.getDownloadRes({
						unifyTypeId: typeId,
						page: $scope.VM.currentPage,
						perPage: $scope.VM.perPage
					}, function(data) {
						console.log("downloadList:", data.data)
						$scope.VM.downloadFileList = data.data;
						$scope.totalItems = data.data.totalLines;
						$scope.total = data.data.total;
					})
				}

				$scope.getDownload();


				//按资源类型选择
				$scope.selectResType = function(type) {
					$scope.VM.resType = type.mtype;
					$scope.VM.currentPage = 1;
					$scope.getDownload(type);
				}

				$scope.changPerPage = function() {
					$scope.VM.currentPage = 1;
					$scope.getDownload();
				}

				//分页
				$scope.pageTo = 1;
				$scope.pageChanged = function(pagenum) {
					if(!!pagenum &&pagenum.split('.').length > 1){
						ModalMsg.logger("请输入正整数");
						return;
					}
					if(pagenum == undefined) {
						$scope.getDownload();
					}
					else if(pagenum > 0 && pagenum <= $scope.total){
						$scope.VM.currentPage = pagenum;
						$scope.getDownload();
					}else {
						ModalMsg.logger("请输入大于0，小于页码总数的正整数~");
					} 
				}
				
			}
		])
}());
