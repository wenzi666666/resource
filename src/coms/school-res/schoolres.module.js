/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.schoolres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('schoolres', {
						url: '/schoolres',
						views: {
							'content@': {
								templateUrl: '/coms/school-res/views/schoolres.html',
								controller: 'SchoolResController'
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
		.factory('SchoolRes', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("SchoolResController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				// 关闭版本筛选
				$scope.closeCurrentVersion = function() {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
				}
				// list切换
				$scope.isList = true;
				
				
			    $scope.switchList = function(list){
			    	$scope.isList = list;
			    }
				
			}
		])
}());