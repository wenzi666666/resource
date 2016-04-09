/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("uploadResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','ModalMsg','Res',
			function($scope, $stateParams, $state, $location, $localStorage,ModalMsg,Res) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				Res.getUploadUrl({}, function(data) {
					
					$scope.uploadData =  data.data
					console.log("uploadData:",$scope.uploadData)
					window.uploadFileInit($scope.uploadData.uploadUrl);
				})
				
				// 编辑完资源信息上传
				$scope.VM = {
					resName: '未命名',
					resSize: 0
				}
				$scope.uploadResInfo = function() {
					var currentFile = JSON.parse(window.localStorage.getItem('ngStorage-currentFile'));
					
					Res.resCtrl({
						names: $scope.VM.resName != '未命名'? $scope.VM.resName:currentFile.name,
						unifTypeIds: '1',
						tfcodes: 'BJCZ02010401',
						scopes: 0,
						keywords: '哈哈',
						descs: '测试',
						paths: $scope.uploadData.uploadPath  + currentFile.path,
						sizes: currentFile.size,
						iscoursewares: 0,
						islocals: 0
					}, function(data) {
						$('#eiditResModel').modal("hide");
						ModalMsg.logger("上传成功啦");
						
						// 上传资源 列表
						Res.getUploadRes({
							unifyTypeId: '1',
							fileFormat: '全部',
							page: 1,
							perPage: 10
						}, function(data) {
							console.log("uploadList:", data.data)
							$scope.VM.uploadFileList = data.data;
						})
					})
				}	
			}
		])
}());
