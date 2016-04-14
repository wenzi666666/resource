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
					// 备课统计
					prepareStatis: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resource/prepareStatis"
					},
					prepareResource: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resource/prepareResource"
					},
					getResType: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resource/unifyType"
					}
				})
			}
		])
		.controller("personalCenterController", ['$scope', '$stateParams', '$state', '$location', '$localStorage', '$uibModal', 'Personal',
			function($scope, $stateParams, $state, $location, $localStorage, $uibModal, Personal) {
				// 变量共享
				$scope.VM = {};

				$scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;

				// 用户信息
				$scope.user = $localStorage.authUser;
				console.log($scope.user);

				// 上传
				$scope.uploadRes = function() {
					var modalNewUpload = $uibModal.open({
						templateUrl: "uploadModal.html",
						windowClass: "upload-modal",
						controller: 'uploadResController',
					})

					// 上传结束
					modalNewUpload.result.then(function(data) {
						console.log(data)
					});
				}

				// 左侧导航 切换
				$scope.switchItemCtrl = [false, true, false, false, false]
				$scope.switchItem = function(index) {
					_.each($scope.switchItemCtrl, function(v, i) {
						$scope.switchItemCtrl[i] = false;
					})
					$scope.switchItemCtrl[index] = true;
				}

				//备课统计
				// 备课数据初始化
				var chartConfig = {
					options: {
						chart: {
							type: 'pie',
						}
					},
					series: [{
						data: [
							['未备课', 0],
							['已备课', 100],
						],
						colors: ['#41C9A9', '#9FE2CF'],
						tooltip: {
							pointFormat: ' <b>{point.percentage:.2f}%</b>'
						}
					}],
					title: {
						text: '备课',
						verticalAlign: 'bottom'
					},
					size: {
						width: 550,
						height: 250
					}
				}
				$scope.chartConfig = {};
				$scope.chartConfig.title = {};
				$scope.chartConfig.title.text = ' ';
				
				// 获取备课数据
				Personal.prepareStatis({}, function(data) {
					$scope.prepare = data.data;
					
					$scope.chartConfig = chartConfig;
					var total = $scope.prepare[0].nodeFinishedNums+ $scope.prepare[0].nodeOmitNums;
					$scope.chartConfig.series[0].data = [['未备课',$scope.prepare[0].nodeOmitNums/total],['已备课', $scope.prepare[0].nodeFinishedNums/total]]
					$scope.chartConfig.title.text = ' ';
				})

			}
		])
}());