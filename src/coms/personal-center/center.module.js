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
								controller: 'PrepareController'
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
					getResType: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resource/unifyType"
					}
				})
			}
		])
		.controller("personalCenterController", ['$scope', '$stateParams', '$state', '$location', '$localStorage', 'Personal',
			function($scope, $stateParams, $state, $location, $localStorage, Personal) {
				$scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;


				
				// 用户信息
				$scope.user = $localStorage.authUser;
				// console.log($scope.user);

				//获取资源类型
				Personal.getResType({

				}, function(data) {
					console.log(data.data);
					$scope.resTypes = data.data;
					$scope.$broadcast('restype', $scope.resTypes);
				})


				//右侧面板显示
				var preUrl = "/coms/personal-center/views/personal-prepare.html";
				var uploadUrl = "/coms/personal-center/views/personal-upload.html";
				var downloadUrl = "/coms/personal-center/views/personal-download.html";
				var commentUrl = "/coms/personal-center/views/personal-comment.html";
				var recentRul = "/coms/personal-center/views/personal-recent.html";
				//默认为资源列表
				$scope.htmlContent = preUrl;
				$scope.contentTitle = "资源上传列表";

				$scope.setContent = function(type) {
					switch(type) {
						case 1:
							$scope.htmlContent = preUrl;
							$scope.contentTitle = "资源上传列表";
							break;
						case 2:
							$scope.htmlContent = uploadUrl;
							$scope.contentTitle = "我的上传";
							break;
						case 3:
							$scope.htmlContent = downloadUrl;
							$scope.contentTitle = "我的下载";
							break;
						case 4:
							$scope.htmlContent = commentUrl;
							$scope.contentTitle = "我的评论";
							break;
						case 5:
							$scope.htmlContent = recentRul;
							$scope.contentTitle = "最近浏览";
							break;
						default:
							$scope.htmlContent = preUrl;
							$scope.contentTitle = "资源上传列表";
					}
				}

				//获取资源，默认类型为全部
				//分页获取，默认为1
				// $scope.currentPage = 1;
				// $scope.pagesize = 10;
				// Personal.prepareResource({
				// 	unifyTypeId: 0,
				// 	page: $scope.currentPage,
				// 	perPage: $scope.pagesize,
				// 	fileFormat: 
				// })

			}
		])
		//引用资源列表控制器
		.controller('prepareContentController', ['$scope', 'Personal', 
			function($scope, Personal) {
				$scope.$on('restype', function(e, types) {
					$scope.resTypes = tyeps;
				});
			}
		])

		//我的上传控制器
		.controller('uploadContentController', ['$scope', 'Personal', 
			function($scope, Personal) {
				$scope.$on('restype', function(e, types) {
					$scope.resTypes = tyeps;
				});
			}
		])

		//我的下载控制器
		.controller('downloadContentController', ['$scope', 'Personal', 
			function($scope, Personal) {
				$scope.$on('restype', function(e, types) {
					$scope.resTypes = tyeps;
				});
			}
		])

		//我的评论控制器
		.controller('commentContentController', ['$scope', 'Personal', 
			function($scope, Personal) {
				$scope.$on('restype', function(e, types) {
					$scope.resTypes = tyeps;
				});
			}
		])
		
		//最近浏览控制器
		.controller('recentContentController', ['$scope', 'Personal', 
			function($scope, Personal) {
				$scope.$on('restype', function(e, types) {
					$scope.resTypes = tyeps;
				});
			}
		])
}());
