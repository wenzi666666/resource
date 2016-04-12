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
								templateUrl: '/coms/layout/footer/footer.html',
								controller: 'LayoutController'
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
		.controller("SearchController", ['$scope', '$stateParams','$localStorage', '$state', '$location', 'Search','SystemRes','ModalMsg',
			function($scope, $stateParams, $localStorage,$state, $location, Search,SystemRes,ModalMsg) {
				// 变量共享
				$scope.VM = {};
				
				// 加载过程显示 转圈
				$scope.isLoading = true;
				
				//搜索资源范围

				$scope.VM.searchArea = [{
						"area": "全部",
						"id": -1
					}, {
						"area": "系统资源",
						"id": 0
					}, {
						"area": "区本资源",
						"id": 4
					}, {
						"area": "校本资源",
						"id": 3
					}

				];

				//资源类型
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

				//资源范围
				$scope.VM.currentAreaSelect = [];
				$scope.VM.currentAreaSelect[0] = true;
				$scope.VM.currentArea = $scope.VM.searchArea[0].area; //文本当前内容
				$scope.VM.currentFromFlag = $scope.VM.searchArea[0].id;
				$scope.VM.selectArea = function(index) {
					//选中
					_.each($scope.VM.searchArea, function(v, i) {
						$scope.VM.currentAreaSelect[i] = false;

					});
					$scope.VM.currentAreaSelect[index] = true;
					$scope.VM.currentArea = $scope.VM.searchArea[index].area;
					$scope.VM.currentFromFlag = $scope.VM.searchArea[index].id;
					$scope.bigCurrentPage = 1;
					getSourceList();
				}

				//资源类型
				$scope.VM.currentTypeNum = [];
				$scope.VM.currentTypeNum[0] = true;
				$scope.VM.currentFormat = $scope.VM.typeNums[0].type;
				$scope.VM.typeClick = function(index) {
					_.each($scope.VM.typeNums, function(v, i) {
						$scope.VM.currentTypeNum[i] = false;

					});
					$scope.VM.currentTypeNum[index] = true;
					$scope.VM.currentFormat = $scope.VM.typeNums[index].type;
					$scope.bigCurrentPage = 1;
					getSourceList();
				}

				//获取资源列表
				$scope.bigCurrentPage = 1;
				$scope.perPage=10;
				$scope.maxSize = 5;
				$scope.searchKeyWord="数学";
				$scope.inputPerPage=10;
				
				 function getSourceList () {
				 	$scope.allSourceId="";//当页所有id字符串
				 	$scope.allFromFlag="";
				 	$scope.sourceList="";
				 	$scope.isLoading = true;
					Search.searchResults({
						fromFlag: $scope.VM.currentFromFlag,
						searchKeyword:$scope.searchKeyWord,
						format: $scope.VM.currentFormat,
						page: $scope.bigCurrentPage,
						perPage: $scope.perPage
					}, function(data) {
						$scope.isLoading = false;
						if (data.code == "OK") {
							$scope.sourceList = data.data.list;
							console.log(data);
							_.each($scope.sourceList, function(v, i) {
								$scope.allSourceId+=$scope.sourceList[i].id+",";
								$scope.allFromFlag+=$scope.sourceList[i].fromFlag+",";
							});
							$scope.allSourceId=$scope.allSourceId.substring(0,$scope.allSourceId.length-1);
							$scope.allFromFlag=$scope.allFromFlag.substring(0,$scope.allFromFlag.length-1);
							
							$scope.listLength = data.data.totalLines;
							$scope.bigTotalItems = $scope.listLength;
							$scope.pageSize=data.data.total;
							console.log("范围："+$scope.VM.currentFromFlag+"==关键字"+$scope.searchKeyWord+"===类型"+$scope.VM.currentFormat+"==当前页"+$scope.bigCurrentPage+"==每页显示"+$scope.perPage+"页数"+$scope.pageSize)
						} else {

							alert(data.code);
						}

					});
				}
				getSourceList();
				
				//搜索内容
				$scope.changeKeyWord=function(){
					
					getSourceList();
				}
				//改变每页条数
				$scope.changePerPage=function(){
					$scope.perPage=$scope.inputPerPage;
					getSourceList();
				}
				//改变页数
				$scope.changePage=function(){
					getSourceList();
				}
				
				//转到
				$scope.pageChanged = function(pagenum) {
					
						$scope.bigCurrentPage = pagenum;
						console.log('Page changed to: ' + $scope.bigCurrentPage );
					    getSourceList();
				};
				
				$scope.pageTo = $scope.bigCurrentPage;
				

				// 全选
				$scope.resList = {
					seletct: [],
					fromFlag:[],
				};
				$scope.checkAll =  function() {
					if(($scope.VM.checkAll)) {
						$scope.resList.select = $scope.sourceList.map(function(item) { return item.id; });
						$scope.resList.fromFlag = $scope.sourceList.map(function(item) { return item.fromFlag; });
						console.log($scope.resList.select);
						console.log($scope.resList.fromFlag);
					}else{
						$scope.resList.select = [];
						$scope.resList.fromFlag=[];
					}
				}
				
				//下载资源 
				$scope.resDownload = function(id,flag){
					SystemRes.resDownload({
						resIds:id,
						fromFlags:flag 
					}, function(data){
						console.log(data.data)
						for(var i=0;i<data.data.length;i++)
						{
							window.open(data.data[i].path, "_blank");
						}
						$scope.resList.select=[];
						$scope.resList.fromFlag=[];
						$scope.VM.checkAll=false;
					});
				}
				
				//多个下载,在搜索页面，fromFlag不一样  
				$scope.addItemSelect = function(flag) {
					$scope.resList.fromFlag.push(flag);
				}
				
				// 全选打包下载
				$scope.downLoadSelect = function() {
					// 全部打包下载
					if(!!$scope.resList.select)
						$scope.resDownload($scope.resList.select.toString(),$scope.resList.fromFlag.toString())
					else {
						ModalMsg.logger("还没有选中资源哦");
					}
				}
				
				
				
			}
		])
}());