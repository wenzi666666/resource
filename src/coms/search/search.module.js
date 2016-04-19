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
						url: '/search/:fromFlag',
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
					},
					resourceFormats:{
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resSearchResults/formats"
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
				$scope.searchKeyWord="";
				if($localStorage.searchKeyWord)
				{
					$scope.searchKeyWord=$localStorage.searchKeyWord;
				}
				
				
				
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

				//资源范围
				$scope.VM.currentAreaSelect = [];
				
				
				if($stateParams.fromFlag)
				{
					 _.each($scope.VM.searchArea, function(v, i) {
						if($stateParams.fromFlag==v.id)
						{
							$scope.VM.currentAreaSelect[i] = true;
							$scope.VM.currentFromFlag = $scope.VM.searchArea[i].id;
							$scope.VM.currentArea = $scope.VM.searchArea[i].area; //文本当前内容
						}
					  });
				}else
				{
					$scope.VM.currentAreaSelect[0] = true;
					$scope.VM.currentFromFlag = $scope.VM.searchArea[0].id;
					$scope.VM.currentArea = $scope.VM.searchArea[0].area; //文本当前内容
				}
				
				$scope.VM.selectArea = function(index) {
					//选中
					_.each($scope.VM.searchArea, function(v, i) {
						$scope.VM.currentAreaSelect[i] = false;

					});
					$scope.VM.currentAreaSelect[index] = true;
					$scope.VM.currentArea = $scope.VM.searchArea[index].area;
					$scope.VM.currentFromFlag = $scope.VM.searchArea[index].id;
					clearPage();
					getFormat();//资源格式
					getSourceList();
				}
				
				//资源格式
				
				function getFormat(){
					$scope.VM.typeNums=[];
					console.log($scope.VM.currentFromFlag,$scope.searchKeyWord)
					Search.resourceFormats({
						fromFlag:$scope.VM.currentFromFlag,
						searchKeyword:$scope.searchKeyWord
					},function(data){
						console.log("格式");
						console.log($scope.VM.currentFromFlag,$scope.searchKeyWord)
					
						if(data.code=="OK")
						{
							console.log(data);
							$scope.VM.typeNums=data.data;
							$scope.VM.currentTypeNum = [];
							$scope.VM.currentTypeNum[0] = true;
							$scope.VM.currentFormat = $scope.VM.typeNums[0];
						}else{
							alert(data.message);
						}
					});
					
				}
				getFormat();//资源格式
				//资源格式切换
				
				$scope.VM.typeClick = function(index) {
					_.each($scope.VM.typeNums, function(v, i) {
						$scope.VM.currentTypeNum[i] = false;

					});
					$scope.VM.currentTypeNum[index] = true;
					$scope.VM.currentFormat = $scope.VM.typeNums[index];
					clearPage();
					
					getSourceList();
				}
				
				//获取资源列表
				$scope.bigCurrentPage = 1;
				$scope.perPage=10;
				$scope.maxSize = 5;
				$scope.inputPerPage=10;
				 function getSourceList () {
				 	$scope.sourceList="";
				 	$scope.isLoading = true;
				 	$scope.showNoInfo=false;
					Search.searchResults({
						fromFlag: $scope.VM.currentFromFlag,
						searchKeyword:$scope.searchKeyWord,
						format: $scope.VM.currentFormat,
						page: $scope.bigCurrentPage,
						perPage: $scope.perPage
					}, function(data) {
						$scope.isLoading = false;
						if (data.code == "OK") {
							$localStorage.searchKeyWord=$scope.searchKeyWord;
							if(data.data.list!=0)
							{	$scope.showNoInfo=false;
								_.each(data.data.list, function(v, i) {
									data.data.list[i].starNum=new Array();
									for(var j=0;j<v.avgScore;j++)
									{
										data.data.list[i].starNum.push(j);
									}
								});
								$scope.sourceList = data.data.list;
								console.log(data);
								$scope.listLength = data.data.totalLines;
								$scope.bigTotalItems = $scope.listLength;
								$scope.pageSize=data.data.total;
								console.log("范围："+$scope.VM.currentFromFlag+"==关键字"+$scope.searchKeyWord+"===类型"+$scope.VM.currentFormat+"==当前页"+$scope.bigCurrentPage+"==每页显示"+$scope.perPage+"页数"+$scope.pageSize)
							}else
							{
								$scope.showNoInfo=true;
							}
							
						} else {

							alert(data.code);
						}

					});
				}
				getSourceList();
				
				//切换清楚分页
				function clearPage(){
					$scope.bigCurrentPage = 1;
					$scope.listLength = 0;
					$scope.bigTotalItems = 0;
					$scope.pageSize=0;
				}
				
			
				//搜索内容
				$scope.changeKeyWord=function(){
					
					getSourceList();
					getFormat();//资源格式
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
					loadIndex:[]
				};
				$scope.checkAll =  function() {
					if(($scope.VM.checkAll)) {
						$scope.resList.select = $scope.sourceList.map(function(item) { return item.id; });
						$scope.resList.fromFlag = $scope.sourceList.map(function(item) { return item.fromFlag; });
						for(var i=0;i<$scope.sourceList.length;i++)
						{
							$scope.resList.loadIndex.push(i);
						}
						console.log($scope.resList.select);
						console.log($scope.resList.fromFlag);
					}else{
						$scope.resList.select = [];
						$scope.resList.fromFlag=[];
						$scope.resList.loadIndex=[];
					}
				}
				
				//下载资源 
				$scope.resDownload = function(id,flag,index){
					console.log(id);
					console.log(flag);
					console.log(index)
					if((typeof index)=="number")
					{
						$scope.sourceList[index].dloadTimes=parseInt($scope.sourceList[index].dloadTimes)+1;
					}else if(typeof index=="object")
					{
						for(var i=0;i<index.length;i++)
						{
							$scope.sourceList[index[i]].dloadTimes=parseInt($scope.sourceList[index[i]].dloadTimes)+1;
						}
					}
					
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
						$scope.VM.checkAll=[];
					});
				}
				
				//多个下载,在搜索页面，fromFlag不一样  
				$scope.addItemSelect = function(flag,index) {
					
						console.log($scope.resList.fromFlag.length);
						console.log($scope.resList.select.length);
						if(($scope.resList.fromFlag.length-1)==$scope.resList.select.length)
						{
							$scope.resList.fromFlag.pop(flag);
							$scope.resList.loadIndex.pop(index);
						}else
						{
							$scope.resList.fromFlag.push(flag);
							$scope.resList.loadIndex.push(index);
						}
					
					// 清除全选
					$scope.VM.checkAll = [];
				}
				
				// 全选打包下载
				$scope.downLoadSelect = function() {
					// 全部打包下载
					if(!!$scope.resList.select)
						$scope.resDownload($scope.resList.select.toString(),$scope.resList.fromFlag.toString(),$scope.resList.loadIndex);
						
					else {
						ModalMsg.logger("还没有选中资源哦");
					}
				}
				
				
				
			}
		])
}());