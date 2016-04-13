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
					source: { //获取系统/区本/校本资源接口
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resRecommendation"
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
					},
					back:{//从当前页返回前一页接口
						method:"GET",
						url:BackendUrl + "/resRestAPI/v1.0/backCourseContent"
					}
					

				})
			}
		])
		.controller("PreviewResController", ['$scope', '$stateParams', '$state', '$location', 'Preview', '$localStorage','ModalMsg','SystemRes','Prepare',
			function($scope, $stateParams, $state, $location, Preview, $localStorage,ModalMsg,SystemRes,Prepare) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				//跳转过来的默认id 和 tfcode   
				//对于tfcode和fromFlag不同页面跳转过来不同  
				//所以后期fromFlag会根据单个资源的fromFlag进行切换 不会只读取localStorage里面的
				$scope.VM.resourceId=$stateParams.resId;
				$scope.VM.tfCode=$stateParams.curTfcode;
				$scope.VM.fromFlag=$localStorage.fromFlag;
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
					$scope.VM.name=$scope.navList[0][$scope.navList[0].length-1].name;
					console.log($scope.VM.tfCode,$scope.VM.name)
					getTypes();//获取资源类型
					
				});
				$scope.VM.curNav = [];
				$scope.VM.curNav[0] = true;
				
				$scope.links=[];
				// 当前目录点击事件
				$scope.back=function(index,tfcode){
					if(index!=0)
					{
						//返回前一页历史状态 //该接口存在问题
						Preview.back({
							tfcode:tfcode
						},function(data){
							console.log("返回前一页数据")
							console.log(data);
							if(data.code=="OK")
							{
								
							}else
							{
								alert(data.message)
							}
						});
						
					}
				}
				$scope.linkMouseover=function(index){
					if(index!=0)
					{
						$scope.links[index]=true;
					}
				}
				$scope.linkMouseout=function(index){
					if(index!=0)
					{
						$scope.links[index]=false;
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
					$scope.VM.name=$scope.navList[index][$scope.navList[index].length-1].name;
					console.log($scope.VM.tfCode);
					getTypes();//获取资源类型
					getPrepare();//获取备课夹
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
				
				//获取资源格式
				
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
						Preview.districtTypes({
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
						Preview.source({
							resId:$scope.VM.resourceId,
							poolId: 0,
							typeId: typeId,//资源格式id
							fromFlag:$localStorage.fromFlag,
							tfcode: $scope.VM.tfCode,
							page: current,
							perPage: 20
						}, function(data) {
							console.log($scope.VM.resourceId,$scope.VM.tfCode,current,typeId)
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
										$scope.VM.fromFlag=$scope.allSourceList[i].fromFlag;
										console.log($scope.VM.fromFlag)
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.allSourceList[0].id;
										$scope.VM.fromFlag=$scope.allSourceList[0].fromFlag;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$localStorage.fromFlag);
								console.log(data.data)
							}else{
								alert(data.message);
							}
							
						});
					} else  if($localStorage.fromFlag == "3" || $localStorage.fromFlag == "4" ){
						//区本或者校本
						Preview.source({
							resId:$scope.VM.resourceId,
							fromFlag:$localStorage.fromFlag,
							typeId: typeId,//资源格式id
							tfcode: $scope.VM.tfCode,
							page: current,
							perPage: 20
	
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
										$scope.VM.fromFlag=$scope.allSourceList[i].fromFlag;
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.allSourceList[0].id;
										$scope.VM.fromFlag=$scope.allSourceList[0].fromFlag;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$localStorage.fromFlag);
								console.log(data.data)
							}else{
								alert(data.message);
							}
						});
					}else{//个人中心/资源定制也跳转过来 不现实其他目录/资源格式默认全部/没有不能加入备课夹
						
						
					}
				}
				 
				 //点击资源切换
				$scope.slideChange=function(id,index,fromFlag){
					_.each($scope.showStar, function(v, i) {
						$scope.curStar[i]=false;
					});
					$scope.currentSlideIndex = index;
					$scope.VM.resourceId=id;
					$scope.VM.fromeFlag=fromFlag;
					$scope.VM.listInfoCom(id,$localStorage.fromFlag);
					for(var i=0;i<$scope.allSourceList.length;i++)
					{
						$scope.curImg[i]=false;
					}
					$scope.curImg[index]=true;
				}

				//上一个
				$scope.slidePre = function() {
					
					if ($scope.currentSlideIndex > 0) {
						_.each($scope.showStar, function(v, i) {
							$scope.curStar[i]=false;
						});
						$scope.VM.listInfoCom($scope.allSourceList[$scope.currentSlideIndex-1].id,$scope.allSourceList[$scope.currentSlideIndex-1].fromFlag);
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
						_.each($scope.showStar, function(v, i) {
							$scope.curStar[i]=false;
						});
						$scope.VM.listInfoCom($scope.allSourceList[$scope.currentSlideIndex+1].id,$scope.allSourceList[$scope.currentSlideIndex+1].fromFlag);
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
					console.log(id,$scope.VM.fromFlag)
					SystemRes.resDownload({
						resIds:id,
						fromFlags: $scope.VM.fromFlag
					}, function(data){
						
						window.open(data.data[0].path, "_blank");
					});
				}
				
				
				//获取备课夹
				// 读取备课夹 列表
				$scope.shopCount=0;
				var currentPrepareId = '';
				 function getPrepare() {
					Prepare.baseGetApi({
						tfcode:$scope.VM.tfCode 
					}, function(data) {
						console.log("prepare:",data.data);
						$scope.prepareList = data.data;
						currentPrepareId = !!$scope.prepareList[0]?$scope.prepareList[0].id:'';
						
					});
				}
				setTimeout(function(){
					getPrepare();
				}, 1000);
				
				//加入备课夹
				//将资源加入当前备课夹，如果没有当前备课夹，创建节点同名备课夹
				$scope.addToCurrentPrepare = function(txt,preId) {
					// 当前没有备课夹时，创建
					if(txt=="list")
					{
						currentPrepareId=preId;
					}
					console.log(currentPrepareId)
					if($scope.prepareList.length == 0) {
						Prepare.basePostApi({
							tfcode: $scope.VM.tfCode,
							title: $scope.VM.name
						}, function(d) {
							// 获取备课夹
							getPrepare();
							
							// 加入备课夹
							Prepare.addResToPrepareId({
								id: d.data.id,
								resIds: $scope.VM.resourceId,
								fromFlags: $scope.VM.fromFlag
							}, function(data) {
								//加1
								$scope.shopCount++;
							})
						})
					}else{
						Prepare.addResToPrepareId({
							id: currentPrepareId,
							resIds: $scope.VM.resourceId,
							fromFlags: $scope.VM.fromFlag
						}, function(data) {
							//加1
							$scope.shopCount++;
							console.log($scope.VM.resourceId+"_"+ $scope.VM.fromFlag)
						})
					}
					
				}
				
				// 新建备课夹
				$scope.VM.newPrepare = "新建备课夹";
				$scope.$watch('VM.newPrepare', function(newVal, oldVal) {
					console.log(newVal,oldVal)
				    if (newVal !== oldVal && newVal != "新建备课夹") {
				    	console.log(newVal,oldVal)
						Prepare.basePostApi({
							tfcode: $scope.VM.tfCode,
							title: $scope.VM.name
						}, function(d) {
							$scope.VM.newPrepare = "新建备课夹"
							getPrepare();
						})
				    }
				 });
				 
				 //显示底部备课夹
				 $scope.VM.showPre=false;
				 $scope.showPre=function(){
				 	if($scope.prepareList.length != 0)
				 	{
				 		$scope.VM.showPre=true;
				 	}
				 	
				 }
				 $scope.hidePre=function(){
				 	$scope.VM.showPre=false;
				 }
				
				
				
			}
		])
}());