
/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myUploadCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage', "$uibModal", 'ModalMsg','Res', 'Personal',
			function($scope, $stateParams, $state, $location, $localStorage, $uibModal, ModalMsg, Res, Personal) {
				//共享变量
				$scope.VM = {};

				// 用户信息
				$scope.user = $localStorage.authUser;
				$scope.VM.currentPage = 1;
				$scope.VM.perPage = 10;
				$scope.maxSize = 3;
				var page = 1;
				// 上传资源 列表
				

				//获取上传资源
				$scope.getResList = function() {
					$scope.VM.uploadFileList = [];
					Res.getUploadRes({
						unifyTypeId: '0',
						fileFormat: '全部',
						page: $scope.VM.currentPage,
						perPage: $scope.VM.perPage
					}, function(data) {
						console.log("uploadList:", data.data)
						$scope.VM.uploadFileList = data.data;
						$scope.totalItems = data.data.totalLines;
					})
				}

				$scope.getResList();
				
				// 监听 上传
				$scope.$on("myUploadChange", function(e, d) {
					$scope.getResList();
				})
				

				//获取资源类型
				Personal.getResType({
					tabCode: "myUpload"
				}, function(data) {
					$scope.resTypes = data.data;	
					$scope.VM.resType = $scope.resTypes[0].mtype; 			
				})

				//按类型筛选资源
				$scope.selectResType = function(type) {
					Res.getUploadRes({
						unifyTypeId: type.id,
						fileFormat: '全部',
						page: $scope.VM.currentPage,
						perPage: $scope.VM.perPage
					}, function(data) {
						console.log("uploadList:", data.data)
						$scope.VM.uploadFileList = data.data;
						$scope.totalItems = data.data.totalLines;
					})
				}

				//添加批量删除资源
				$scope.resToBeDelete = [];
				$scope.addResDeleting = function(id) {
					$scope.resToBeDelete.push(id);
				}

				$scope.deleteSingleRes = function(id) {
					var deleteModal = ModalMsg.confirm("确定删除该上传资源？");
					deleteModal.result.then(function(data) {
						if(data) {
							Res.deleteUploadRes({
								_method: "DELETE",
								resIds: id
							}, function(data) {
								ModalMsg.logger("删除资源成功！");
								$scope.getResList();
							})
						}
					}) 
				}

				//批量删除资源
				$scope.deleteSomeRes = function() {
					if($scope.resToBeDelete.length == 0) {
						ModalMsg.logger("您没有选择任何资源");
					}
					else {
						var deleteModal = ModalMsg.confirm("确定批量删除这些上传资源？");
						deleteModal.result.then(function(data) {
							if(data) {
								Res.deleteUploadRes({
									_method: "DELETE",
									resIds: $scope.resToBeDelete.join(',')
								}, function(data) {
									ModalMsg.logger("删除资源成功！");
									$scope.getResList();
								})
							}
						}) 
					}
				}

				//编辑资源
				$scope.editRes = function(res) {
					console.log(res)
					// 获取资源详细信息
					Res.getResDetails({
						id: res.resId
					}, function(data){
						var resDetails = data.data;
						var editResModal = $uibModal.open({
							templateUrl: "eiditResModal.html",
							windowClass: "upload-modal",
							controller: 'editResInstanceCtrl',
							resolve: {
								resitem: function() {
									return res;
								},
								resDetails: function() {
									return resDetails;
								}
							}
						})
	
						editResModal.result.then(function(data) {
							console.log(data);
						})
					})
					
				}

				//预览自建资源
				$scope.previewRes = function(res) {
					//已转换为可预览格式
					console.log(res);
					if(res.isFinished == 0) {
						$state.go('previewres', {resId:res.resId,curTfcode:'',fromFlag:1,search:'person',type:'1',back: 'upload'});
					}
					else {
						ModalMsg.alert("该资源正在转码中，暂时不能预览，请稍后重试！");
					}
				}

				//分页
				$scope.pageTo = 1;
				$scope.pageChanged = function(pagenum) {
					console.log($scope.VM.currentPage);
					if(pagenum == undefined) {
						$scope.getResList();
					}
					else {
						$scope.VM.currentPage = pagenum;
						$scope.getResList();
					}
				}

				$scope.changPerPage = function() {
					$scope.VM.currentPage = 1;
					$scope.getResList();
				}
			}
		])
}());

//问题：编辑我的上传资源UI，接口在上传资源位置
