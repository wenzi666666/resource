/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.previewres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('previewres', {
						url: '/previewres/:resId/:curTfcode',
						views: {
							'content@': {
								templateUrl: '/coms/res-preview/views/previewres.html',
								controller: 'PreviewResController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header2.html',
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
		.factory('Preview', ['$resource',
			function($resource) {
				return $resource('', {}, {
					// 获取资源的所有版本目录
					lists: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/preview/lists  "
					},
					listInfo: { //获取单个资源的详细信息
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resPreviewInfo"
					},
					myComment: { //查询自己评论
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/myComments"
					},
					editComment: { ////删除，修改 新建评论
						method: "POST",
						url: BackendUrl + "/resRestAPI/v1.0/myComments"
					},

					otherComment: { //查询他人评论
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/otherComments"
					},
					systemSource: { //获取系统资源接口
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/sysResource"
					},
					districtSource: { //获取区本/校本接口
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/districtResource"
					},
					resViewUrl:{
						method:"GET",
						url:BackendUrl + "/resRestAPI/v1.0/resViewUrl"
					},
					systemTypes:{//获取系统资源类型
						method:"GET",
						url:BackendUrl + "/resRestAPI/v1.0/sysResource/types"
					},
					districtTypes:{//获取校本/区本系统资源类型
						method:"GET",
						url:BackendUrl + "/resRestAPI/v1.0/districtResource/types"
					}
					

				})
			}
		])
		.controller("PreviewResController", ['$scope', '$stateParams', '$state', '$location', 'Preview', '$localStorage','ModalMsg','SystemRes',
			function($scope, $stateParams, $state, $location, Preview, $localStorage,ModalMsg,SystemRes) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				//跳转过来的默认id 和 tfcode
				$scope.VM.resourceId=$stateParams.resId;
				$scope.VM.tfCode=$stateParams.curTfcode;
				console.log($stateParams)

				
				// 资源nav数据
				Preview.lists({
					resId: $scope.VM.resourceId,
					curTfcode: $scope.VM.tfCode,
					fromFlag: $localStorage.fromFlag

				}, function(data) {
					
					$scope.navList = data.data;
					$scope.currentNav = $scope.navList[0];
					$scope.VM.tfCode=$scope.navList[0][$scope.navList[0].length-1].tfcode;
					console.log($scope.VM.tfCode)
					getTypes();//获取资源类型
					
				});
				$scope.VM.curNav = [];
				$scope.VM.curNav[0] = true;
				
				$scope.links=[];
				$scope.links[1]=true;
				//返回上一页
				$scope.back=function(index,tfcode){
					if(index==1)
					{
						history.back();
					}
				}
				
				//切换目录
				$scope.selectNav = function(index) {
					//选中
					_.each($scope.navList, function(v, i) {
						$scope.VM.curNav[i] = false;
					});
					$scope.VM.curNav[index] = true;
					$scope.currentNav = $scope.navList[index];
					$scope.VM.tfCode=$scope.navList[index][$scope.navList[index].length-1].tfcode;
					console.log($scope.VM.tfCode);
					getTypes();//获取资源类型
				}
				
				$scope.selectType=function(id,index){
					_.each($scope.sourceType, function(v, i) {
						$scope.typeLight[i] = false;
					});
					$scope.typeLight[index]=true;
					$scope.typeName=$scope.sourceType[index].mtype;
					current=1;
					$scope.allSourceList=[];
					getAllSource(id);
					$scope.sourceTypeId=id;
				}
				
				//获取资源类型
				
				function getTypes(){
					$scope.sourceType=[];
					$scope.sourceTypeId=0;
					$scope.typeLight=[];
					$scope.typeLight[0]=true;
					if ($localStorage.fromFlag == "0") 
					{//系统资源类型
						Preview.systemTypes({
							poolId:0,
							pTfcode:$scope.VM.tfCode,
						},function(data){
							console.log("类型")
							console.log(data);
							if(data.code=="OK")
							{
								$scope.sourceType=data.data;
								$scope.sourceTypeId=$scope.sourceType[0].id;
								$scope.typeName=$scope.sourceType[0].mtype;
								current=1;
								$scope.allSourceList=[];
								getAllSource($scope.sourceTypeId);//获取对应资源
							}
								
							else{
								alert(data.message);
							}
							
						})
					}
					else
					{//区本/校本资源类型
						Preview.systemTypes({
							poolId:0,
							tfcode:$scope.VM.tfCode,
						},function(data){
							console.log("类型")
							console.log(data);
							if(data.code=="OK")
							{
								$scope.sourceType=data.data;
								$scope.sourceTypeId=$scope.sourceType[0].id;
								$scope.typeName=$scope.sourceType[0].mtype;
								current=1;
								$scope.allSourceList=[];
								getAllSource($scope.sourceTypeId);//获取对应资源
							}
								
							else{
								alert(data.message);
							}
						});
					}
				}
				
				//获取所有资源
				var pageSize=0;
				var current=1;
				$scope.allSourceList=[];
				 //加载更多资源
				 $scope.getAllSourceMore=function(){
				 	
				 	if(current<pageSize)
				 	{
				 		current++;
				 		
				 	}else{
				 		ModalMsg.logger("没有更多啦")
				 		return false;
				 	}
				 	console.log($scope.sourceTypeId);
				 	getAllSource($scope.sourceTypeId);
				 }
				 
				 function getAllSource(typeId) {
			      	//获取所有资源相关变量
					$scope.currentSlideIndex = 0;
					$scope.curImg=[];
					if ($localStorage.fromFlag == "0") {
						//系统
						Preview.systemSource({
							poolId: 0,
							mTypeId: typeId,//资源类型id
							fileFormat: "全部",//资源格式
							orderBy: 0,
							tfcode: $scope.VM.tfCode,
							page: current,
							perPage: 20
						}, function(data) {
							console.log(data)
							if(data.code=="OK")
							{	
								pageSize=data.data.total;
								$scope.localIndex=0;
								
								_.each(data.data.list, function(v, i) {
									$scope.allSourceList.push(data.data.list[i]);
								});
								
								for(var i=0;i<$scope.allSourceList.length;i++)
								{	$scope.curImg[i]=false;
									if($scope.VM.resourceId==$scope.allSourceList[i].id)
									{
										$scope.currentSlideIndex=i; 
										$scope.curImg[i]=true;
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.allSourceList[0].id
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$localStorage.fromFlag);
								console.log(data.data)
							}else{
								alert(data.message);
							}
							
						});
					} else {
						//区本或者校本
						Preview.districtSource({
							mTypeId: typeId,
							fileFormat: "全部",
							orderBy: 0,
							tfcode: $scope.VM.tfCode,
							page: 1,
							perPage: 20,
							fromFlag: $localStorage.fromFlag
	
						}, function(data) {
							if(data.code=="OK")
							{	pageSize=data.data.total;
								$scope.localIndex=0;
								
								_.each(data.data.list, function(v, i) {
									$scope.allSourceList.push(data.data.list[i]);
								});
								for(var i=0;i<$scope.allSourceList.length;i++)
								{	$scope.curImg[i]=false;
									if($scope.VM.resourceId==$scope.allSourceList[i].id)
									{
										$scope.currentSlideIndex=i; 
										$scope.curImg[i]=true;
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.allSourceList[0].id
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$localStorage.fromFlag);
								console.log(data.data)
							}else{
								alert(data.message);
							}
						});
					}
				}
				 
				 //点击资源切换
				$scope.slideChange=function(id,index){
					$scope.currentSlideIndex = index;
					$scope.VM.listInfoCom(id,$localStorage.fromFlag);
					$scope.VM.resourceId=id;
					for(var i=0;i<$scope.allSourceList.length;i++)
					{
						$scope.curImg[i]=false;
					}
					$scope.curImg[index]=true;
				}

				//上一个
				$scope.slidePre = function() {
					if ($scope.currentSlideIndex > 0) {
						$scope.VM.listInfoCom($scope.allSourceList[$scope.currentSlideIndex-1].id,$localStorage.fromFlag);
						$scope.currentSlideIndex --;
						for(var i=0;i<$scope.allSourceList.length;i++)
						{
							$scope.curImg[i]=false;
						}
						$scope.curImg[$scope.currentSlideIndex]=true;
					} else {
						$scope.currentSlideIndex = $scope.allSourceList.length - 1;
					}
				}
					//下一个
				$scope.slideNext = function() {
					if ($scope.currentSlideIndex < $scope.allSourceList.length - 1) {
						$scope.VM.listInfoCom($scope.allSourceList[$scope.currentSlideIndex+1].id,$localStorage.fromFlag);
						$scope.currentSlideIndex ++;
						for(var i=0;i<$scope.allSourceList.length;i++)
							{
								$scope.curImg[i]=false;
							}
						$scope.curImg[$scope.currentSlideIndex]=true;
					} else {
						$scope.currentSlideIndex = 0;
					}
				}
				
				// 全屏切换
				$scope.toggleFullscreen = function() {
					if (screenfull.enabled) {
					    screenfull.toggle($('.slide-container')[0]);
					}
				}
				
				//下载资源
				$scope.resDownload = function(id){
					SystemRes.resDownload({
						resIds:id,
						fromFlags: $localStorage.fromFlag
					}, function(data){
						
						window.open(data.data[0].path, "_blank");
					});
				}
				
				
				
			}
		])
}());