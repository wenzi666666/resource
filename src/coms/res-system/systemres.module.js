/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.systemres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('systemres', {
						url: '/systemres',
						views: {
							'content@': {
								templateUrl: '/coms/res-system/views/systemres.html',
								controller: 'SystemResController'
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
		.factory('SystemRes', ['$resource',
			function($resource) {
				return $resource('', {}, {
					total: {method: "GET",url: window.BackendUrl + "/api/discuss/home/total"}
				})
			}
		])
		.controller("SystemResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes','$http',
			function($scope, $stateParams, $state, $location,SystemRes,$http) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
//				SystemRes.total({
//					
//				}, function(data, status){
//					console.log(data)
//				});
//				$http.get("http://chat.tfedu.net:8080/discuss/login").then(function(data){
//					console.log(data)
//				})
				
				$.ajax({
					method: "get",
//					url:"http://chat.tfedu.net:8080/discuss/home/total",
					url:"http://chat.tfedu.net:8080/discuss/userMessage/draftsNumber",
					dataType: "json",
					beforeSend: function(xhr){
						console.log(xhr)
						xhr.setRequestHeader("SM_USER", "dzhangliangang")
					},
					success: function(data){
						console.log(data)
					}
				})
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
			    
  			   $scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
				
			}
		])
}());