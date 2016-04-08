/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("uploadResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','$uibModal',
			function($scope, $stateParams, $state, $location, $localStorage,$uibModal) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				$scope.sysAvatarPath = "assets/img/settings/tab_active.png";
				$scope.selfAvatarPath = "assets/img/settings/tab2.png";
				
//				$scope.uploadFile = function() {
				
//				}
			}
		])
}());
