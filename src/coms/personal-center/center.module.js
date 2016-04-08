/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('personalcenter', {
						url: '/personalcenter',
						views: {
							'content@': {
								templateUrl: '/coms/personal-center/views/personal-center.html',
								controller: 'personalCenterController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('Personal', ['$resource',
			function($resource) {
				return $resource('', {}, {
					prepareResource: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resource/prepareResource"
					},
					// 上传资源 服务
					getUploadUrl: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resource/upload"
					},
					
				})
			}
		])
		.controller("personalCenterController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','$uibModal','Personal',
			function($scope, $stateParams, $state, $location, $localStorage,$uibModal,Personal) {
				$scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
				
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				// 上传
				$scope.uploadRes = function() {
					$('#uploadModel').modal("show");
				}
				
				Personal.getUploadUrl({}, function(data) {
					var url = data.data.uploadUrl;
					
					uploadFileInit(url);
				})
				
			}
		])
}());
