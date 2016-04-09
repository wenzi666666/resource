/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myUploadCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage','ModalMsg','Res',
			function($scope, $stateParams, $state, $location, $localStorage,ModalMsg,Res) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				// 上传资源 列表
				Res.getUploadRes({
					userId: $scope.user.userId,
					unifyTypeId: '1',
					fileFormat: '全部',
					page: 1,
					perPage: 10
				}, function(data) {
					console.log(data.data)
				})
				
			}
		])
}());
