/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("uploadResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','$uibModal', 'ModalMsg','Res','Upload','$timeout',
			function($scope, $stateParams, $state, $location, $localStorage,$uibModal,ModalMsg,Res,Upload,$timeout) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				Res.getUploadUrl({}, function(data) {
					
					$scope.uploadData =  data.data
					console.log("uploadData:",$scope.uploadData)
//					
				})
				
				// 编辑完资源信息上传
				$scope.VM = {
					resName: '未命名',
					resSize: 0
				}
				
				// 第一屏显示
				$scope.firstUpload = true;
				$scope.files = {};
				$scope.uploadFiles = function(files, errFiles) {
				  	$scope.firstUpload = false;
				  	
			        $scope.files = files;
//			        $scope.errFiles = errFiles;
			        angular.forEach(files, function(file) {
			        	console.log(file)
			            file.upload = Upload.upload({
			                url: $scope.uploadData.uploadUrl,
			                data: {file: file}
			            });
			
			            file.upload.then(function (response) {
			                $timeout(function () {
			                    file.result = response.data;
			                    console.log( response.data)
			                });
			            }, function (response) {
			            	console.log( response.data)
			                if (response.status > 0)
			                    $scope.errorMsg = response.status + ': ' + response.data;
			            }, function (evt) {
			                file.progress = Math.min(100, parseInt(100.0 *  evt.loaded / evt.total));
			              	$scope.progress =  file.progress;
			            });
			        });
			    }
				
				$scope.VM.uploadResInfo = function() {
//					if(!!$localStorage.files) {
						var modalNewUpload = $uibModal.open({
							templateUrl: "eiditResModal.html",
							windowClass: "upload-modal",
							controller: 'editResController',
							scope:$scope //Refer to parent scope here
						})
//					}
				}	
			}
		])
		// 编辑资源信息
		.controller("editResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','$uibModal', 'ModalMsg','Res','Upload','$timeout',
			function($scope, $stateParams, $state, $location, $localStorage,$uibModal,ModalMsg,Res,Upload,$timeout) {
				
				console.log($scope.uploadData)
				
				// 获取资源类型
				Res.unifyType({}, function(data) {
					$scope.unifyType =  data.data;
				})
				
				$scope.uploadResInfo = function() {
					$scope.VM.name = $scope.files.name.split('.')[0];
					Res.resCtrl({
						names: $scope.files.name.split('.')[0],
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
