/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.settings')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('settings', {
						url: '/settings',
						views: {
							'content@': {
								templateUrl: '/coms/settings/views/settings.html',
								controller: 'SettingsController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header3.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('Settings', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("SettingsController", ['$scope', '$stateParams', '$state', '$location', '$uibModal', 
			function($scope, $stateParams, $state, $location, $uibModal) {
				// 变量共享
				$scope.VM = {};
				var test="test";
				$scope.VM.avatarModal = $uibModal.open({
			      	templateUrl: 'avatar.html',
			      	controller: 'avatarInstanceController',
			      	size: '',
			      	resolve: {
			      		test: function() {
			      			return test;
			      		}
			      		}
	    			});	
				$scope.changeAvatar = function() {
					$scope.VM.avatarModal = $uibModal.open({
			      	templateUrl: 'avatar.html',
			      	controller: 'avatarInstanceController',
			      	size: '',
			      	resolve: {
			      		test: function() {
			      			return test;
			      		}
			      		}
	    			});	
				}
			}
		])
		.controller('avatarSettingController', ['$scope', '$uibModal',
			function($scope, $uibmodal) {
				//变量共享
				
			}
		])
		.controller('avatarInstanceController', ['$scope', '$uibModalInstance', 'test',
			function($scope, $uibModalInstance, test) {
				$scope.test = test;
				$scope.panelOneShow = true;
				$scope.panelTwoShow = false;
				$scope.panelThreeShow = false;
				
				$scope.showPanel = function(index) {
					if(index == 1) {
						$scope.panelOneShow = true;
						$scope.panelTwoShow = false;
						$scope.panelThreeShow = false;
					}
					else if(index == 2) {
						$scope.panelOneShow = false;
						$scope.panelTwoShow = true;
						$scope.panelThreeShow = false;
					}
					else {
						$scope.panelOneShow = false;
						$scope.panelTwoShow = false;
						$scope.panelThreeShow = true;
					}
				}
				
				$scope.close = function() {
					$uibModalInstance.close();
				}
			}
		])
		
}());