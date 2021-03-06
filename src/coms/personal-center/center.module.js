/**
 * 个人中心模块
 */
(function () {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.config(['$stateProvider',
			function ($stateProvider) {
				$stateProvider
					.state('personalcenter', {
						url: '/personalcenter/:back',
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
			function ($resource) {
				return $resource('', {}, {
					// 备课统计
					prepareStatis: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/prepareStatis"
					},
					prepareResource: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/prepareResource"
					},
					getResType: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/personalTab/resType"
					},
					getComment: {//获取评论列表
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/userReview"
					},
					getUnreview: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/unReview"
					},
					delCom: {//删除评论
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/userReview"
					},
					getDownloadRes: {//获取下载
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/myDownload"
					},
					getRecentView: {//获取最近浏览
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/userview"
					}

				})
			}
		])
		.controller("personalCenterController", ['$scope', '$stateParams', '$state', '$location', '$localStorage', '$uibModal', 'Personal', 'ModalMsg', 'Res',
			function ($scope, $stateParams, $state, $location, $localStorage, $uibModal, Personal, ModalMsg, Res) {
				// 变量共享
				$scope.VM = {};

				$scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;

				// 用户信息
				$scope.user = $localStorage.authUser;
				// 上传
				$scope.uploadRes = function () {
					var modalNewUpload = $uibModal.open({
						templateUrl: "uploadModal.html",
						windowClass: "upload-modal",
						controller: 'uploadResController',
					})

					// 上传结束
					modalNewUpload.result.then(function (data) {
						// 更新上传列表
						// console.log(data)
						$scope.$broadcast('myUploadChange', "OK");
					});
				}

				// 左侧导航 切换
				$scope.switchItemCtrl = [false, false, false, false, false]

				$scope.switchItem = function (index) {
					_.each($scope.switchItemCtrl, function (v, i) {
						$scope.switchItemCtrl[i] = false;
					})
					$scope.switchItemCtrl[index] = true;
					$localStorage.switchItemCtrl = index;
				}


				if (!!$stateParams.back) {
					$scope.switchItem($stateParams.back);
				}
				else {
					$scope.switchItem($localStorage.switchItemCtrl ? $localStorage.switchItemCtrl : 0);
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
							['未收藏', 0],
							['已收藏', 100],
						],
						colors: ['#41C9A9', '#9FE2CF'],
						tooltip: {
							pointFormat: ' <b>{point.percentage:.2f}%</b>'
						}
					}],
					title: {
						text: '收藏',
						verticalAlign: 'bottom'
					},
					size: {
						width: 450,
						height: 250
					}
				}
				$scope.chartConfig = {};
				$scope.chartConfig.title = {};
				$scope.chartConfig.title.text = ' ';

				// 获取备课数据
				Personal.prepareStatis({}, function (data) {
					$scope.prepare = data.data;

					if (data.data.length > 0) {
						// init data
						initCharData(0);
					} else {
						$scope.noPrepareData = true;
					}


				})

				// 备课统计数据
				var index = 0;
				var initCharData = function (i) {
					index = i;
					$scope.currentPrepare = $scope.prepare[i];
					$scope.chartConfig = chartConfig;
					var total = $scope.prepare[i].nodeFinishedNums + $scope.prepare[i].nodeOmitNums;
					$scope.chartConfig.series[0].data = [['未收藏', $scope.prepare[i].nodeOmitNums / total], ['已收藏', $scope.prepare[i].nodeFinishedNums / total]]
					$scope.chartConfig.title.text = ' ';
				}

				// 向前
				$scope.pre = function () {
					if (index > 0) {
						index--;
						initCharData(index)
					} else {
						ModalMsg.logger("已经是第一个啦")
					}
				}

				// 向前
				$scope.next = function () {
					if (index < $scope.prepare.length - 1) {
						index++;
						initCharData(index)
					} else {
						ModalMsg.logger("已经是最后一个啦")
					}
				}


				$scope.VM.uploadResInfo = function () {
					var modalNewUpload = $uibModal.open({
						templateUrl: "eiditResModal.html",
						windowClass: "upload-modal",
						controller: 'editResController',
						scope: $scope //Refer to parent scope here
					})
				}
			}
		])
}());