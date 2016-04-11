/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myCommentCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage','ModalMsg','Res',
			function($scope, $stateParams, $state, $location, $localStorage,ModalMsg,Res) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				//我的备课 列表
				Res.getMyComment({
					unifyTypeId: '0',
					fileFormat: '全部',
					page: 1,
					perPage: 10
				}, function(data) {
					console.log("commentList:", data.data)
					$scope.commentList = data.data;
				})
			}
		])
}());
