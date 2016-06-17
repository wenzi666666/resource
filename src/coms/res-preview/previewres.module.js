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
						url: '/previewres/:resId/:curTfcode/:fromFlag/:search/:type/:back',
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
						url: TomcatUrl + "/resRestAPI/v1.0/preview/lists  "
					},
					listInfo: { //获取单个资源的详细信息
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resPreviewInfo"
					},
					myComment: { //查询自己评论
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/myComments"
					},
					editComment: { ////删除，修改 新建评论
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/myComments"
					},

					otherComment: { //查询他人评论
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/otherComments"
					},
					source: { //获取系统/区本/校本资源接口
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resRecommendation"
					},
					resViewUrl:{
						method:"GET",
						url:TomcatUrl + "/resRestAPI/v1.0/resViewUrl"
					},
					systemTypes:{//获取系统资源类型
						method:"GET",
						url:TomcatUrl + "/resRestAPI/v1.0/sysResource/types"
					},
					districtTypes:{//获取校本/区本系统资源类型
						method:"GET",
						url:TomcatUrl + "/resRestAPI/v1.0/districtResource/types"
					},
					back:{//从当前页返回前一页接口
						method:"GET",
						url:TomcatUrl + "/resRestAPI/v1.0/backCourseContent"
					}
					

				})
			}
		])
		.controller("PreviewResController", ['$scope', '$stateParams', '$state', '$location', 'Preview', '$localStorage','ModalMsg','Res','Prepare','$uibModal',
			function($scope, $stateParams, $state, $location, Preview, $localStorage,ModalMsg,Res,Prepare,$uibModal) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				//跳转过来的默认id 和 tfcode   
				//对于tfcode和fromFlag不同页面跳转过来不同  
				//所以后期fromFlag会根据单个资源的fromFlag进行切换 不会只读取localStorage里面的
				$scope.VM.resourceId=$stateParams.resId;
				$scope.VM.tfCode=$localStorage.currentTreeNode.tfcode;
				$scope.VM.name=$localStorage.currentTreeNode.label;
				$scope.VM.fromFlag=$localStorage.fromFlag;
				$scope.VM.name=$localStorage.currentTreeNode.label;
				$scope.VM.search="html";
				$scope.searchKeyWord=$localStorage.searchKeyWord;
				// console.log("关键字"+$scope.searchKeyWord);
				$scope.VM.load=true;//加载
				
				if($stateParams.search=="search")
				{//如果是搜索页则使用该fromFlag
					$scope.VM.fromFlag=$stateParams.fromFlag;
					$scope.VM.search="search";
					// console.log("搜索页跳转");
					// console.log($scope.VM.fromFlag);
				}else if($stateParams.search=="person")
				{
					$scope.VM.fromFlag=$stateParams.fromFlag;
					$scope.VM.personType=$stateParams.type;
					$scope.VM.search="person";
				}else if($stateParams.search=="prepare")
				{
					$scope.VM.fromFlag=$stateParams.fromFlag;
					$scope.VM.search="prepare";
				}

				//资源格式下拉显示问题
				$scope.VM.preShow=false;
				//所有资源列表显示
				$scope.VM.resShow=false;
				//左右切换
				$scope.VM.slide=false;
				//评分和发布显示问题
				$scope.VM.comShow=false;
				//备课夹显示问题
				$scope.VM.prepareShow=false;
				
				//当前页
				var current=1;
				
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
					//获取单个资源信息
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
					getAllSource("");//获取对应资源
					$scope.VM.preShow=true;
					$scope.VM.comShow=true;
				}else if($scope.VM.search=="prepare")
				{//备课夹
					$scope.sourceType=[{"id":"0","mtype":"全部"}];
					$scope.sourceTypeId=0;
					$scope.typeLight=[];
					$scope.typeLight[0]=true;
					$scope.typeName="全部";
					$scope.VM.resShow=true;
					$scope.VM.slide=true;
					$scope.VM.preShow=true;
					//获取单个资源信息
					$scope.VM.prepareShow=true;
					$scope.currentNav = [{"name":"备课夹"}];
					$scope.links[0]=true;
					setTimeout(function(){					
						$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
					},300);
				}
				else
				{//系统/区本/校本 资源nav数据
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
				
				
				//资源定制/个人中心返回链接
				if($stateParams.back)
				{
					var back=$stateParams.back;
					
					if(back=="custom")
					{
						$scope.currentNav = [{"name":"资源定制"}];
					}else if(back=="0")
					{
						$scope.currentNav = [{"name":"我的备课"}];
					}else if(back=="1")
					{
						$scope.currentNav = [{"name":"我的上传"}];
					}else if(back=="2")
					{
						$scope.currentNav = [{"name":"我的下载"}];
					}else if(back=="3")
					{
						$scope.currentNav = [{"name":"我的评论"}];	
					}else if(back=="4")
					{
						$scope.currentNav = [{"name":"最近浏览"}];	
					}
					$scope.links[0]=true;
					
				}
				
				// 当前目录点击事件
				$scope.back=function(index,tfcode){
					if(index==2 && $scope.VM.search=="html")
					{//系统/区本/校本
						if($localStorage.fromFlag=="0")
						{
							$state.go('systemres',{});
						}else if($localStorage.fromFlag=="3")
						{
							$state.go('schoolres',{});
						}else if($localStorage.fromFlag=="4")
						{
							$state.go('areares',{});
						}
						
					}else if(index==0 && $scope.VM.search=="search")
					{//搜索页 返回
						$state.go('search', {fromFlag:$stateParams.fromFlag});
						
					}else if(index==0 && $stateParams.back=="custom")
					{//资源定制页返回
						$state.go('customres',{});
					}else if(index==0 && $stateParams.back!="custom" && $scope.VM.search=="person")
					{//个人中心页面返回
						$state.go('personalcenter', {back:$stateParams.back});
					}else if(index==0 && $stateParams.search=="prepare")
					{//备课夹返回
						
						$state.go('prepare',{})
					}
				}
				
				//切换资源格式
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
				
				//获取资源格式 只在系统/区本/校本跳转调用
				function getTypes(){
					$scope.sourceType=[];
					$scope.sourceTypeId= $localStorage.types?$localStorage.types.id:0;
					$scope.typeLight=[];
					$scope.typeLight[0]=true;
					if ($scope.VM.fromFlag == "0") 
					{//系统资源类型
						Preview.systemTypes({
							poolId:0,
							pTfcode:$scope.VM.tfCode,
						},function(data){
							if(data.code=="OK")
							{
								$scope.sourceType=data.data;
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
							fromFlag: $localStorage.fromFlag,
							tfcode:$scope.VM.tfCode
						},function(data){
							if(data.code=="OK")
							{
								$scope.sourceType=data.data;
//								$scope.sourceTypeId=$scope.sourceType[0].id;
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
//				var current=1;
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
				 	getAllSource($scope.sourceTypeId);
				 }
				 
				 function getAllSource(typeId) {
			      	//获取所有资源相关变量
					$scope.currentSlideIndex = 0;
					$scope.curImg=[];
					if (($scope.VM.fromFlag == "0")&&($scope.VM.search=="html")) {
						// 系统
						Preview.source({
							resId:$scope.VM.resourceId,
							poolId: 0,
							typeId: typeId,//资源格式id
							format: $localStorage.format?$localStorage.format:'全部',
							fromFlag:$scope.VM.fromFlag,
							tfcode: $scope.VM.tfCode,
							page: current,
							perPage: 20,
							orderBy:$localStorage.orderBy
						}, function(data) {
							$scope.VM.load=false;
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
										$scope.VM.resName=$scope.VM.allSourceList[i].title;
					
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
										$scope.VM.resName=$scope.VM.allSourceList[0].title;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
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
							format: $localStorage.format?$localStorage.format:'全部',
							tfcode: $scope.VM.tfCode,
							page: current,
							perPage: 20,
							orderBy:$localStorage.orderBy
						}, function(data) {
							$scope.VM.load=false;
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
										$scope.VM.resName=$scope.VM.allSourceList[i].title;
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
										$scope.VM.resName=$scope.VM.allSourceList[0].title;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
								
							}else{
								alert(data.message);
							}
						});
					}else if($scope.VM.search=="search")
					{
						//搜索页面资源 跳转
						Preview.source({
							resId: $scope.VM.resourceId,
							searchKeyword: $scope.searchKeyWord,
							fromFlag: $scope.VM.fromFlag,
							format: $localStorage.searchFormat?$localStorage.searchFormat:'全部',
							isSearch: 1,
							page: current,
							perPage: 20
						}, function(data) {
							$scope.VM.load=false;
					
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
										$scope.VM.resName=$scope.VM.allSourceList[i].title;
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
										$scope.VM.resName=$scope.VM.allSourceList[0].title;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);

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
										$scope.VM.resName=$scope.VM.allSourceList[i].title;
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
										$scope.VM.resName=$scope.VM.allSourceList[0].title;
								}
								$scope.VM.listInfoCom($scope.VM.resourceId,$scope.VM.fromFlag);
								
							}else{
								alert(data.message);
							}
							
						});
						
					}
				}
				 
				 //点击资源切换
				$scope.slideChange = function(id,index,fromFlag){
					_.each($scope.showStar, function(v, i) {
						$scope.curStar[i]=false;
					});
					$scope.currentSlideIndex = index;
					$scope.VM.resourceId=id;
					$scope.VM.fromFlag=fromFlag;
					$scope.VM.resName=$scope.VM.allSourceList[index].title;
					$scope.VM.listInfoCom(id,fromFlag);
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
						$scope.currentSlideIndex --;
						$(".slide-list").animate({scrollTop:$scope.currentSlideIndex*152},500);
						$scope.VM.resName=$scope.VM.allSourceList[$scope.currentSlideIndex].title;
						$scope.VM.listInfoCom($scope.VM.allSourceList[$scope.currentSlideIndex].id,$scope.VM.allSourceList[$scope.currentSlideIndex].fromFlag);
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
						{
							$scope.curImg[i]=false;
						}
						$scope.curImg[$scope.currentSlideIndex]=true;
						
					} else {
						_.each($scope.showStar, function(v, i) {
							$scope.curStar[i]=false;
						});
						$scope.currentSlideIndex = $scope.VM.allSourceList.length - 1;
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
							{
								$scope.curImg[i]=false;
							}
						$scope.curImg[$scope.currentSlideIndex]=true;
						$(".slide-list").animate({scrollTop:$scope.currentSlideIndex*152},500);
						$scope.VM.resName=$scope.VM.allSourceList[$scope.currentSlideIndex].title;
						$scope.VM.listInfoCom($scope.VM.allSourceList[$scope.currentSlideIndex].id,$scope.VM.allSourceList[$scope.currentSlideIndex].fromFlag);
					}
				}
					//下一个
				$scope.slideNext = function() {
					if ($scope.currentSlideIndex < $scope.VM.allSourceList.length - 1) {
						_.each($scope.showStar, function(v, i) {
							$scope.curStar[i]=false;
						});
						$scope.currentSlideIndex ++;
						$(".slide-list").animate({scrollTop:$scope.currentSlideIndex*152},500);
						$scope.VM.resName=$scope.VM.allSourceList[$scope.currentSlideIndex].title;
						$scope.VM.listInfoCom($scope.VM.allSourceList[$scope.currentSlideIndex].id,$scope.VM.allSourceList[$scope.currentSlideIndex].fromFlag);
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
							{
								$scope.curImg[i]=false;
							}
						$scope.curImg[$scope.currentSlideIndex]=true;
					} else {
						_.each($scope.showStar, function(v, i) {
							$scope.curStar[i]=false;
						});
						$scope.currentSlideIndex = 0;
						for(var i=0;i<$scope.VM.allSourceList.length;i++)
							{
								$scope.curImg[i]=false;
							}
						$scope.curImg[$scope.currentSlideIndex]=true;
						$(".slide-list").animate({scrollTop:$scope.currentSlideIndex*152},500);
						$scope.VM.resName=$scope.VM.allSourceList[$scope.currentSlideIndex].title;
						$scope.VM.listInfoCom($scope.VM.allSourceList[$scope.currentSlideIndex].id,$scope.VM.allSourceList[$scope.currentSlideIndex].fromFlag);
					}
				}
				
				// 全屏切换
				$scope.toggleFullscreen = function() {
					openwin($scope.VM.fpath);
				}
				
				//下载资源
				$scope.resDownload = function(id){
					Res.resDownload({
						resIds:id,
						fromFlags: $scope.VM.fromFlag
					}, function(data){
						openwin(data.data[0].path);
						$scope.VM.info.dloadTimes=	$scope.VM.info.dloadTimes+1;
					});
				}
				
				
				//获取备课夹
				// 读取备课夹 列表
				var currentPrepareId = '';
				// 当前节点备课夹 列表
				var getPrepare = function () {
				 	//获取当前节点 备课夹
					Prepare.GetSelfPrepare({
						tfcode:$scope.VM.tfCode 
					}, function(data) {
						
						$scope.prepareDataList = data.data;
						currentPrepareId = $scope.prepareDataList[0]?$scope.prepareDataList[0].id:'';
						
					});
				}
				 
				//获取 最近三个备课夹
				var getLatesPrepare = function(showModal) {
					Prepare.latestPrepare({}, function(data) {
						$scope.prepareList = data.data;
						if(showModal){
							ModalMsg.chromeLogger("成功加入备课夹：" + $scope.prepareList[0].title);
						}
					})
				}
				setTimeout(function(){
					getPrepare();
					getLatesPrepare();
				}, 600);
				
				//加入备课夹
				//将资源加入当前备课夹，如果没有当前备课夹，创建节点同名备课夹
				$scope.addToCurrentPrepare = function(txt,preId) {
					// 当前没有备课夹时，创建
					if(txt=="list")
					{
						currentPrepareId=preId;
					}
					if($scope.prepareDataList.length == 0 && !preId) {
						Prepare.basePostApi({
							tfcode: $scope.VM.tfCode,
							title: $scope.VM.name
						}, function(d) {
							// 加入备课夹
							Prepare.addResToPrepareId({
								id: d.data.id,
								resIds: $scope.VM.resourceId,
								fromFlags: $scope.VM.fromFlag
							}, function(data) {
								// 获取备课夹
								getPrepare();
								// 获取最近三个备课夹
								getLatesPrepare(true);
								// 动画显示
								addPrepareAnimation();
							})
						})
					}else{
						Prepare.addResToPrepareId({
							id: currentPrepareId,
							resIds: $scope.VM.resourceId,
							fromFlags: $scope.VM.fromFlag
						}, function(data) {
							if(data.code == 'OK' || data.code == 'ok') {
								// 获取备课夹
								getPrepare();
								// 获取最近三个备课夹
								getLatesPrepare(true);
								// 动画显示
								addPrepareAnimation();
							} else {
								ModalMsg.chromeLogger(data.message);
							}
						})
					}
					
				}
				 
				 // 选择备课夹
				$scope.selectPrepare = function(e,listIndex) {
					e.stopPropagation();
					var optypeText = '选择备课夹';
					var selectPrepareModal = $uibModal.open({
						templateUrl: "select-prepare.html",
						controller: 'selectPrepareCtrl',
						resolve: {
							optypeText: function() {
								return optypeText;
							}
						},
						windowClass: "prepare-select-modal"
					})

					//到备课夹
					selectPrepareModal.result.then(function(data) {
						Prepare.addResToPrepareId({
							id: data.prepareId,
							resIds: $scope.VM.resourceId,
							fromFlags: $scope.VM.fromFlag
						}, function(d) {
							if(d.code == "OK") {
								getPrepare();
								getLatesPrepare(true);
								// 动画显示
								addPrepareAnimation();
							}
							else {
								ModalMsg.chromeLogger("加入备课夹失败，请重试！")
							}
						})
					});
				}
				 
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