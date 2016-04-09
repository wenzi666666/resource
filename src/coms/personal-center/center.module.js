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
								templateUrl: '/coms/layout/footer/footer.html',
								controller: 'LayoutController'
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
					}
				})
			}
		])
		.controller("personalCenterController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','$uibModal','Personal',
			function($scope, $stateParams, $state, $location, $localStorage,$uibModal,Personal) {
				// 变量共享
				$scope.VM = {};
				
				$scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
				
				// 用户信息
				$scope.user = $localStorage.authUser;
				
				// 上传
				$scope.uploadRes = function() {
					$('#uploadModel').modal("show");
				}
				
				// 左侧导航 切换
				$scope.switchItemCtrl = [true,false,false,false,false]
				$scope.switchItem = function(index) {
					_.each($scope.switchItemCtrl, function(v, i) {
						$scope.switchItemCtrl[i] = false;
					})
					$scope.switchItemCtrl[index] = true;
				}
				
			}
		])
}());
