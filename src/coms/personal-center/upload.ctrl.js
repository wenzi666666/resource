/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("uploadResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','$uibModal','Personal',
			function($scope, $stateParams, $state, $location, $localStorage,$uibModal,Personal) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				Personal.getUploadUrl({}, function(data) {
					var url = data.data.uploadUrl;
					console.log(url)
					uploadFileInit(url);
				})
			}
		])
}());
