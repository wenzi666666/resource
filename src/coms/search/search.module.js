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
				
				
				//搜索类型
				$scope.VM.currentAreaSelect = [];
				$scope.VM.currentAreaSelect[0] = true;
				$scope.VM.searchArea = [{
						"area": "全部",
						"id":0
					}, {
						"area": "系统资源",
						"id":1
					}, {
						"area": "区本资源",
						"id":4
					}, {
						"area": "校本资源",
						"id":3
					}

				];
				$scope.VM.currentArea = $scope.VM.searchArea[0].area;//文本当前内容
				$scope.VM.currentFromFlag=$scope.VM.searchArea[0].id;
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
				$scope.VM.currentFormat=$scope.VM.typeNums[0].type;
				
				//资源范围
				$scope.VM.selectArea = function(index) {
					$scope.VM.currentArea = $scope.VM.searchArea[index].area;
					$scope.VM.currentFromFlag=$scope.VM.searchArea[index].id;
					
					//选中
					_.each($scope.VM.searchArea, function(v, i) {
						$scope.VM.currentAreaSelect[i] = false;
						
					});
					$scope.VM.currentAreaSelect[index] = true;
				}
				
				//资源类型
				$scope.VM.typeClick=function(index){
					_.each($scope.VM.typeNums, function(v, i) {
						$scope.VM.currentTypeNum[i] = false;
						
					});
					$scope.VM.currentTypeNum[index]=true;
					$scope.VM.currentFormat=$scope.VM.typeNums[index].type;
				}
				
				
				//获取资源列表
				Search.searchResults({
					fromFlag: $scope.VM.currentFromFlag,
					searchKeyword: '数学',
					format: $scope.VM.currentFormat,
					page: 1,
					perPage: 10
				}, function(data) {
					if(data.code=="OK")
					{
						$scope.sourceList=data.data.list;
						console.log(data);
						$scope.listLength=data.data.totalLines;
						$scope.pageSize=data.data.total;
						$scope.maxSize = 3;
						$scope.bigTotalItems = $scope.listLength;
						$scope.bigCurrentPage = 1;
						
					}else{
						
						console.log("系统异常");
					}	
					
				});
				
				$scope.isCheck=false;
				$scope.allCheck=false;
				
				

			}
		])
}());