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
					}
				})
			}
		])
		.controller("CustomResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes', '$http',
			function($scope, $stateParams, $state, $location, SystemRes, $http) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				$scope.VM.fromFlag = 0; //资源定制页fromFllag都为0

				// 下载资源
				$scope.resDownload = function(id) {
					SystemRes.resDownload({
						resIds: id,
						fromFlags: $scope.VM.fromFlag = 0
					}, function(data) {
						if (data.code == "OK") {
							window.open(data.data[0].path, "_blank");
						}

					});
				}

				$scope.VM.resource = [{
					"subject": "数学",
					"page": 1,
					"perPage": 4,
					"totalLines": 2,
					"total": 1,
					item: [{
						"mtype": "动画",
						"fromFlag": 0,
						"thumbnailpath": "http://192.168.111.22:8099/down/get.do?uid=100798967857546&file=TmV3UmVzb3VyY2VCYW5rXERIS1xHWlwwMTAyXEZMMDRcRkwwNDAxXHRmZWR1MDAwMDA4MTU2OVxzdWZmZXIvc3VmZmVyX2ljb24uanBn&sn=tfedu&sign=8e56f7efd94b4f899a1fb616766baaa4&disk=1",
						"id": 57822,
						"title": "词汇学习 Suffer",
						"resCode": "tfedu0000081569",
					}, {
						"fromFlag": 0,
						"thumbnailpath": "http://192.168.111.22:8099/down/get.do?uid=100798967857546&file=TmV3UmVzb3VyY2VCYW5rXERIS1xHWlwwMTAyXEZMMDRcRkwwNDAxXHRmZWR1MDAwMDExNTE0NC90ZmVkdTAwMDAxMTUxNDRfaWNvbi5qcGc%3D&sn=tfedu&sign=2dc56856c32d0b7496c22683dd73193b&disk=1",
						"id": 75409,
						"title": " Game: Differences",
						"resCode": "tfedu0000115144",
						"mtype": "交互练习",
					}]
				}, {
					"subject": "英语",
					"page": 1,
					"perPage": 4,
					"totalLines": 2,
					"total": 1,
					item: [{
						"fromFlag": 0,
						"thumbnailpath": "http://192.168.111.22:8099/down/get.do?uid=100798967857546&file=TmV3UmVzb3VyY2VCYW5rXERIS1xHWlwwMTAyXEZMMDRcRkwwNDAxXHRmZWR1MDAwMDExNTE0Ni90ZmVkdTAwMDAxMTUxNDZfaWNvbi5qcGc%3D&sn=tfedu&sign=bac58431ed6e8ee8bd8e6d487d23c8c8&disk=1",
						"id": 75411,
						"title": "Game: Differences",
						"resCode": "tfedu0000115146",
						"mtype": "动画",
					}, {
						"fromFlag": 0,
						"thumbnailpath": "http://192.168.111.22:8099/down/get.do?uid=100798967857546&file=TmV3UmVzb3VyY2VCYW5rXERIS1xHWlwwMTAyXEZMMDRcRkwwNDAxXHRmZWR1MDAwMDEzOTIzMFx1MSBpbnNwaXJlL2luc3BpcmVfaWNvbi5qcGc%3D&sn=tfedu&sign=260a30955a100ef72f93aa844f50e787&disk=1",
						"id": 90498,
						"title": "互动型 词汇学习 Inspire",
						"resCode": "tfedu0000139230",
						"mtype": "交互练习",
					},
					{
						"fromFlag": 0,
						"thumbnailpath": "http://192.168.111.22:8099/down/get.do?uid=100798967857546&file=TmV3UmVzb3VyY2VCYW5rXERIS1xHWlwwMTAyXEZMMDRcRkwwNDAxXHRmZWR1MDAwMDEzOTIzMFx1MSBpbnNwaXJlL2luc3BpcmVfaWNvbi5qcGc%3D&sn=tfedu&sign=260a30955a100ef72f93aa844f50e787&disk=1",
						"id": 90498,
						"title": "互动型 词汇学习 Inspire",
						"resCode": "tfedu0000139230",
						"mtype": "交互练习",
					},{
						"fromFlag": 0,
						"thumbnailpath": "http://192.168.111.22:8099/down/get.do?uid=100798967857546&file=TmV3UmVzb3VyY2VCYW5rXERIS1xHWlwwMTAyXEZMMDRcRkwwNDAxXHRmZWR1MDAwMDEzOTIzMFx1MSBpbnNwaXJlL2luc3BpcmVfaWNvbi5qcGc%3D&sn=tfedu&sign=260a30955a100ef72f93aa844f50e787&disk=1",
						"id": 90498,
						"title": "互动型 词汇学习 Inspire",
						"resCode": "tfedu0000139230",
						"mtype": "交互练习",
					}]

				}];

				console.log($scope.VM.resource);
				//分页
				$scope.VM.perPage = 4;
				$scope.maxSize = 3;
				$scope.VM.bigTotalItems = []; //数据总共多少条
				$scope.VM.bigCurrentPage = []; //当前页
				$scope.VM.pageTo = []; //跳转页
				
				_.each($scope.VM.resource, function(v, i) {
					$scope.VM.bigTotalItems[i] = v.totalLines;
					
				});
				
				
				
				$scope.pageChanged = function(index, pagenum) {
					console.log(pagenum);
					if (pagenum == undefined) {
						//加载列表 点击页数
					} else {
						$scope.VM.bigCurrentPage[index] = pagenum;
						//加载列表 跳转
					}
				};

				//转到
				$scope.pageTo = $scope.VM.currentPageCtrl;

			}
		])
}());