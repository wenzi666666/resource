/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.customres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('customres', {
						url: '/customres',
						views: {
							'content@': {
								templateUrl: '/coms/res-custom/views/customres.html',
								controller: 'CustomResController'
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
		.factory('CustomtemRes', ['$resource',
			function($resource) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: window.BackendUrl + "/api/discuss/home/total"
					},
					resource:{
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/customizeRes"
					}
				})
			}
		])
		.controller("CustomResController", ['$scope', '$stateParams', '$state', '$location', 'Res', '$http','CustomtemRes','$localStorage',
			function($scope, $stateParams, $state, $location, Res, $http,CustomtemRes,$localStorage) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				$scope.VM.fromFlag = 0; //资源定制页fromFllag都为0
				$scope.VM.load=true;
				
				// 下载资源
				$scope.resDownload = function(id) {
					Res.resDownload({
						resIds: id,
						fromFlags: $scope.VM.fromFlag = 0
					}, function(data) {
						if (data.code == "OK") {
							window.open(data.data[0].path, "_blank");
						}
					});
				}
				
				//获取资源列表
				$scope.VM.resource = [];
				CustomtemRes.resource({
					
				},function(data){
					$scope.VM.load=false;
					console.log("定制资源列表")
					if(data.code=="OK")
					{
						console.log(data.data);
						$scope.VM.resource = data.data;
					}else
					{
						alert(data.message);
					}
				});
				
				

				console.log($scope.VM.resource);
				
				
				//分页
//				$scope.VM.perPage = 4;
//				$scope.maxSize = 3;
//				$scope.VM.bigTotalItems = []; //数据总共多少条
//				$scope.VM.bigCurrentPage = []; //当前页
//				$scope.VM.pageTo = []; //跳转页
//				_.each($scope.VM.resource, function(v, i) {
//					$scope.VM.bigTotalItems[i] = v.totalLines;
//				});
//				$scope.pageChanged = function(index, pagenum) {
//					console.log(pagenum);
//					if (pagenum == undefined) {
//						//加载列表 点击页数
//					} else {
//						$scope.VM.bigCurrentPage[index] = pagenum;
//						//加载列表 跳转
//					}
//				};
//				//转到
//				$scope.pageTo = $scope.VM.currentPageCtrl;
				
			}
		]);
}());