/**
 * 路由跳转 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.router')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('router', {
						url: '/router',
						views: {
							'content@': {
								template: '',
								controller: 'RouterController'
							}
						}
					})
			}
		])

		.controller("RouterController", ['$scope', '$stateParams', '$state', 'ModalMsg','Layout', 
			function($scope, $stateParams, $state, ModalMsg,Layout) {
				// 调用 接口判断是否 token是否有效
				Layout.autoLearning({},function(data) {
					if (data.code == "OK") {
						$state.go('systemres')
							
					} else {
						if(data.code == "KickOutTokenException") {
							ModalMsg.logger(data.message);
							setTimeout(function(){
								$scope.logout();
							}, 2000)
						}else{
							$scope.logout();
						}
					}
				})
				
				//退出
				$scope.logout = function() {
					localStorage.removeItem("ngStorage-authUser");
					localStorage.removeItem("credentialsToken");
					localStorage.removeItem("ngStorage-currentGrade");
					localStorage.removeItem("ngStorage-currentMaterial");
					localStorage.removeItem("ngStorage-currentSubject");
					localStorage.removeItem("ngStorage-currentTreeNode");
					localStorage.removeItem("ngStorage-currentVersion");
					window.location.href= "login.html";
				}
				
			}
		])
}());