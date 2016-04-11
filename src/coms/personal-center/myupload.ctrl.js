/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myUploadCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage','ModalMsg','Res', 'Personal',
			function($scope, $stateParams, $state, $location, $localStorage,ModalMsg,Res,Personal) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				
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

				//获取所有资源类型
				Personal.getResType({}, function(data) {
					$scope.resTypes = data.data;				
				})

				//添加批量删除资源
				$scope.resToBeDelete = [];
				$scope.addResDeleting = function(id) {
					$scope.resToBeDelete.push(id);
				}

				$scope.deleteSingleRes = function(id) {
					var deleteModal = ModalMsg.confirm("确定删除该上传资源？");
					deleteModal.result.then(function(data) {
						if(data) {
							Res.getUploadRes({
								_method: "DELETE",
								resIds: id
							}, function(data) {
								ModalMsg.logger("删除资源成功！");
							})
						}
					}) 
				}

				$scope.deleteSomeRes = function() {
					if($scope.resToBeDelete.length == 0) {
						ModalMsg.logger("您没有选择任何资源");
					}
					else {
						var deleteModal = ModalMsg.confirm("确定批量删除这些上传资源？");
						deleteModal.result.then(function(data) {
							if(data) {
								Res.getUploadRes({
									_method: "DELETE",
									resIds: $scope.resToBeDelete.join(',')
								}, function(data) {
									ModalMsg.logger("删除资源成功！");
								})
							}
						}) 
					}
				}
			}
		])
}());

//问题：编辑我的上传资源UI，接口在上传资源位置
