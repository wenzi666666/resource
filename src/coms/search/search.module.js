/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.search')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('search', {
						url: '/search',
						views: {
							'content@': {
								templateUrl: '/coms/search/views/search.html',
								controller: 'SearchController'
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
		.factory('Search', ['$resource',
			function($resource) {
				return $resource('', {}, {
					searchResults: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resSearchResults"
					}
				})
			}
		])
		.controller("SearchController", ['$scope', '$stateParams', '$state', '$location','Search',
			function($scope, $stateParams, $state, $location,Search) {
				// 变量共享
				$scope.VM = {};
				
				//测试接口
				Search.searchResults({
					fromFlag: 1,
					searchKeyword: '数学',
					format: '全部',
					page: 1,
					perPage: 10
				}, function(data) {
					console.log(data)
				})
				
				//搜索类型
				$scope.VM.currentTypeSeclet = [];
				$scope.VM.currentTypeSeclet[0] = true;
				$scope.VM.searchType = [{
						"type": "全部"
					}, {
						"type": "视频"
					}, {
						"type": "图片"
					}, {
						"type": "文本"
					}

				];
				$scope.VM.currentType = $scope.VM.searchType[0].type;//文本当前内容
				
				
				
				//对应类型数目
				$scope.VM.typeNums = [{
						"type": "全部",
						"num": 10
					}, {
						"type": "视频",
						"num": 4
					}, {
						"type": "图片",
						"num": 4
					}, {
						"type": "文本",
						"num": 2
					}

				];
				$scope.VM.currentTypeNum = [];
				$scope.VM.currentTypeNum[0]=true;


				$scope.VM.selectType = function(index) {
					$scope.VM.currentType = $scope.VM.searchType[index].type;
					//选中
					_.each($scope.VM.searchType, function(v, i) {
						$scope.VM.currentTypeSeclet[i] = false;
						$scope.VM.currentTypeNum[i]=false;
					});
					$scope.VM.currentTypeSeclet[index] = true;
					$scope.VM.currentTypeNum[index]=true;
				}


			}
		])
}());