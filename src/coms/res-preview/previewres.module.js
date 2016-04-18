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
						url: '/previewres/:resId/:curTfcode/:fromFlag/:search/:type',
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
				
				$scope.VM.search="html";
				$scope.searchKeyWord=localStorage.searchKeyWord;
				console.log($scope.searchKeyWord);
				$scope.VM.load=true;//加载
				
				if($stateParams.search=="search")
				{//如果是搜索页则使用该fromFlag
					$scope.VM.fromFlag=$stateParams.fromFlag;
					$scope.VM.search="search";
					console.log("搜索页跳转");
					console.log($scope.VM.fromFlag);
				}else if($stateParams.search=="person")
				{
					$scope.VM.fromFlag=$stateParams.fromFlag;
					$scope.VM.personType=$stateParams.type;
					$scope.VM.search="person";
					console.log("个人中心页面");
					console.log($scope.VM.fromFlag,$scope.VM.personType);
				}
				
				
				console.log($stateParams);
				
				
				
				//资源格式下拉显示问题
				$scope.VM.preShow=false;
				//所有资源列表显示
				$scope.VM.resShow=false;
				//左右切换
				$scope.VM.slide=false;
				//评分和发布显示问题
				$scope.VM.comShow=false;
				
				//当前目录  返回显示
				$scope.links=[];
				if($scope.VM.search=="search")
				{//如果是搜索页则不加载目录//和格式
					$scope.sourceType=[{"id":"0","mtype":"全部"}];
					$scope.sourceTypeId=0;
					$scope.typeLight=[];
					$scope.typeLight[0]=true;
					$scope.typeName="全部";
					getAllSource("");//获取对应资源
					$scope.currentNav = [{"name":"”"+$localStorage.searchKeyWord+"“ 搜索结果"}];
					$scope.links[0]=true;
					$scope.VM.preShow=true;
					$scope.VM.tfCode=$localStorage.currentTreeNode.tfcode;
					$scope.VM.name=$localStorage.currentTreeNode.label;
					console.log("搜索页tfcode,name"+	$scope.VM.tfCode+$scope.VM.name)
				}
				else if($scope.VM.search=="person" && $scope.VM.personType=="0")
				{//个人中心页面 非上传 没有推荐资源  资源定制页情况一样
					$scope.sourceType=[{"id":"0","mtype":"全部"}];
					$scope.sourceTypeId=0;
					$scope.typeLight=[];
					$scope.typeLight[0]=true;
					$scope.typeName="全部";
					$scope.VM.resShow=true;
					$scope.VM.slide=true;
					$scope.VM.preShow=true;
					$scope.VM.tfCode=$localStorage.currentTreeNode.tfcode;
					$scope.VM.name=$localStorage.currentTreeNode.label;
					//获取单个资源信息
					console.log("个人中心  单个资源信息"+$scope.VM.resourceId+","+$scope.VM.fromFlag);
					setTimeout(function(){					
						$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
					},300);
				}
				else if($scope.VM.search=="person" && $scope.VM.personType=="1")
				{//个人中心页面 上传页面
					$scope.sourceType=[{"id":"0","mtype":"全部"}];
					$scope.sourceTypeId=0;
					$scope.typeLight=[];
					$scope.typeLight[0]=true;
					$scope.typeName="全部";
					$scope.VM.tfCode=$localStorage.currentTreeNode.tfcode;
					$scope.VM.name=$localStorage.currentTreeNode.label;
					getAllSource("");//获取对应资源
					$scope.VM.preShow=true;
					$scope.VM.comShow=true;
				}
				else
				{//系统/区本/校本 资源nav数据
					console.log("系统/区本/校本"+$scope.VM.tfCode,$scope.VM.resourceId,$scope.VM.fromFlag)
					Preview.lists({
						resId: $scope.VM.resourceId,
						curTfcode: $scope.VM.tfCode,
						fromFlag: $scope.VM.fromFlag
					}, function(data) {
						$scope.navList = data.data;
						$scope.currentNav = $scope.navList[0];
						$scope.VM.tfCode=$scope.navList[0][$scope.navList[0].length-1].tfcode;
						$scope.VM.name=$scope.navList[0][$scope.navList[0].length-1].name;
						$scope.links[2]=true;
						getTypes();//获取资源类型
					});	
					
				}
				
				// 当前目录点击事件
				$scope.back=function(index,tfcode){
					if(index==2 && $scope.VM.search=="html")
					{
						history.back();
					}else if(index==0 && $scope.VM.search=="search")
					{
						history.back();
					}
				}
				
				
				
//				//切换目录
//				$scope.selectNav = function(index) {
//					//选中
//					_.each($scope.navList, function(v, i) {
//						$scope.VM.curNav[i] = false;
//					});
//					$scope.VM.curNav[index] = true;
//					$scope.currentNav = $scope.navList[index];
//					$scope.VM.tfCode=$scope.navList[index][$scope.navList[index].length-1].tfcode;
//					$scope.VM.name=$scope.navList[index][$scope.navList[index].length-1].name;
//					console.log($scope.VM.tfCode);
//					getTypes();//获取资源类型
//					getPrepare();//获取备课夹
//				}
				
				$scope.selectType=function(id,index){
					_.each($scope.sourceType, function(v, i) {
						$scope.typeLight[i] = false;
					});
					$scope.typeLight[index]=true;
					$scope.typeName=$scope.sourceType[index].mtype;
					current=1;
					$scope.VM.allSourceList=[];
					getAllSource(id);
					$scope.sourceTypeId=id;
				}
				
				//获取资源格式
				function getTypes(){
					
					$scope.sourceType=[];
					$scope.sourceTypeId=0;
					$scope.typeLight=[];
					$scope.typeLight[0]=true;
					if ($scope.VM.fromFlag == "0") 
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
								$scope.VM.allSourceList=[];
								getAllSource($scope.sourceTypeId);//获取对应资源
							}
							else{
								alert(data.message);
							}
							
						})
					}
					else if($scope.VM.fromFlag == "3" || $scope.VM.fromFlag == "4" )
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
								$scope.VM.allSourceList=[];
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
				$scope.VM.allSourceList=[];
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
					if (($scope.VM.fromFlag == "0")&&($scope.VM.search=="html")) {
						//系统
						Preview.source({
							resId:$scope.VM.resourceId,
							poolId: 0,
							typeId: typeId,//资源格式id
							fromFlag:$scope.VM.fromFlag,
							tfcode: $scope.VM.tfCode,
							page: current,
							perPage: 20
						}, function(data) {
							$scope.VM.load=false;
							console.log($scope.VM.resourceId,$scope.VM.tfCode,current,typeId)
							console.log(data)
							if(data.code=="OK")
							{	
								pageSize=data.data.total;
								$scope.localIndex=0;
								
								_.each(data.data.list, function(v, i) {
									$scope.VM.allSourceList.push(data.data.list[i]);
								});
								
								for(var i=0;i<$scope.VM.allSourceList.length;i++)
								{	$scope.curImg[i]=false;
									if($scope.VM.resourceId==$scope.VM.allSourceList[i].id)
									{
										$scope.currentSlideIndex=i; 
										$scope.curImg[i]=true;
										$scope.VM.fromFlag=$scope.VM.allSourceList[i].fromFlag;
										console.log($scope.VM.fromFlag)
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.VM.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.VM.allSourceList[0].id;
										$scope.VM.fromFlag=$scope.VM.allSourceList[0].fromFlag;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
								console.log(data.data)
							}else{
								alert(data.message);
							}
							
						});
					} else  if(($scope.VM.fromFlag == "3" || $scope.VM.fromFlag == "4")&&($scope.VM.search=="html") ){
						//区本或者校本
						Preview.source({
							resId:$scope.VM.resourceId,
							fromFlag:$scope.VM.fromFlag,
							typeId: typeId,//资源格式id
							tfcode: $scope.VM.tfCode,
							page: current,
							perPage: 20
	
						}, function(data) {
							$scope.VM.load=false;
							if(data.code=="OK")
							{	
								console.log(data.data)
								pageSize=data.data.total;
								$scope.localIndex=0;
								
								_.each(data.data.list, function(v, i) {
									$scope.VM.allSourceList.push(data.data.list[i]);
								});
								for(var i=0;i<$scope.VM.allSourceList.length;i++)
								{	$scope.curImg[i]=false;
									if($scope.VM.resourceId==$scope.VM.allSourceList[i].id)
									{
										$scope.currentSlideIndex=i; 
										$scope.curImg[i]=true;
										$scope.VM.fromFlag=$scope.VM.allSourceList[i].fromFlag;
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.VM.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.VM.allSourceList[0].id;
										$scope.VM.fromFlag=$scope.VM.allSourceList[0].fromFlag;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
								
							}else{
								alert(data.message);
							}
						});
					}else if((($scope.VM.fromFlag == "0") || ($scope.VM.fromFlag == "-1") || ($scope.VM.fromFlag == "3") || ($scope.VM.fromFlag == "4"))&&($scope.VM.search=="search")){
						//搜索页面系统资源 //头部显示加上数目
						Preview.source({
							resId:$scope.VM.resourceId,
							searchKeyword:$scope.searchKeyWord,
							fromFlag:$scope.VM.fromFlag,
							isSearch: 1,
							page: current,
							perPage: 20
						}, function(data) {
							$scope.VM.load=false;
							console.log(data)
							if(data.code=="OK")
							{	
								pageSize=data.data.total;
								$scope.localIndex=0;
								_.each(data.data.list, function(v, i) {
									$scope.VM.allSourceList.push(data.data.list[i]);
								});
								
								for(var i=0;i<$scope.VM.allSourceList.length;i++)
								{	$scope.curImg[i]=false;
									if($scope.VM.resourceId==$scope.VM.allSourceList[i].id)
									{
										$scope.currentSlideIndex=i; 
										$scope.curImg[i]=true;
										$scope.VM.fromFlag=$scope.VM.allSourceList[i].fromFlag;
										console.log($scope.VM.fromFlag)
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.VM.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.VM.allSourceList[0].id;
										$scope.VM.fromFlag=$scope.VM.allSourceList[0].fromFlag;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
								console.log(data.data)
							}else{
								alert(data.message);
							}
							
						});
					}else if($scope.VM.search=="person" && $scope.VM.personType=="1")
					{
						//个人中心页面上传推荐资源 
						Preview.source({
							resId:$scope.VM.resourceId,
							fromFlag:$scope.VM.fromFlag,
							page: current,
							perPage: 20
						}, function(data) {
							$scope.VM.load=false;
							console.log(data)
							if(data.code=="OK")
							{	console.log("个人中心上传跳转")
								pageSize=data.data.total;
								$scope.localIndex=0;
								_.each(data.data.list, function(v, i) {
									$scope.VM.allSourceList.push(data.data.list[i]);
								});
								
								for(var i=0;i<$scope.VM.allSourceList.length;i++)
								{	$scope.curImg[i]=false;
									if($scope.VM.resourceId==$scope.VM.allSourceList[i].id)
									{
										$scope.currentSlideIndex=i; 
										$scope.curImg[i]=true;
										$scope.VM.fromFlag=$scope.VM.allSourceList[i].fromFlag;
										console.log($scope.VM.fromFlag)
										break;
										
									}else{
										$scope.localIndex++;
									}
								}
								if($scope.localIndex==$scope.VM.allSourceList.length)
								{		
									    $scope.currentSlideIndex=0; 
										$scope.curImg[0]=true;
										$scope.VM.resourceId=$scope.VM.allSourceList[0].id;
										$scope.VM.fromFlag=$scope.VM.allSourceList[0].fromFlag;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
								console.log(data.data)
							}else{
								alert(data.message);
							}
							
						});
						
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
					$scope.VM.listInfoCom(id,$scope.VM.fromFlag);
					for(var i=0;i<$scope.VM.allSourceList.length;i++)
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
						$scope.VM.listInfoCom($scope.VM.allSourceList[$scope.currentSlideIndex-1].id,$scope.VM.allSourceList[$scope.currentSlideIndex-1].fromFlag);
						$scope.currentSlideIndex --;
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
						{
							$scope.curImg[i]=false;
						}
						$scope.curImg[$scope.currentSlideIndex]=true;
					} else {
						$scope.currentSlideIndex = $scope.VM.allSourceList.length - 1;
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
							{
								$scope.curImg[i]=false;
							}
						$scope.curImg[$scope.currentSlideIndex]=true;
					}
				}
					//下一个
				$scope.slideNext = function() {
					if ($scope.currentSlideIndex < $scope.VM.allSourceList.length - 1) {
						_.each($scope.showStar, function(v, i) {
							$scope.curStar[i]=false;
						});
						$scope.VM.listInfoCom($scope.VM.allSourceList[$scope.currentSlideIndex+1].id,$scope.VM.allSourceList[$scope.currentSlideIndex+1].fromFlag);
						$scope.currentSlideIndex ++;
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
							{
								$scope.curImg[i]=false;
							}
						$scope.curImg[$scope.currentSlideIndex]=true;
					} else {
						
						$scope.currentSlideIndex = 0;
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
							{
								$scope.curImg[i]=false;
							}
						$scope.curImg[$scope.currentSlideIndex]=true;
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
						$scope.VM.info.dloadTimes=	$scope.VM.info.dloadTimes+1;
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