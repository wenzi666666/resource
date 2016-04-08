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
								templateUrl: '/coms/layout/footer/footer.html'
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
		.controller("PreviewResController", ['$scope', '$stateParams', '$state', '$location', 'Preview', '$localStorage',
			function($scope, $stateParams, $state, $location, Preview, $localStorage) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				//跳转过来的默认id 和 tfcode
				$scope.VM.resourceId=$stateParams.resId;
				$scope.VM.tfCode=$stateParams.curTfcode;
				console.log($stateParams)
				//星星 评分
				$scope.showStar=[1,2,3,4,5];
				$scope.curStar=[];
				$scope.hoverStar=[];
				$scope.mouseOverStar=function(index){
					var len=0;
					for(var i=0;i<$scope.curStar.length;i++)
					{
						if($scope.curStar[i]==true)
						{
							len++;
						}
					}
					if(len==0)
					{
						//加上颜色 starHover;
						for(var i=0;i<=index;i++)
						{
							$scope.hoverStar[i]=true;
						}
					}
				}
				$scope.mouseOutStar=function(index){
					var len=0;
					for(var i=0;i<$scope.curStar.length;i++)
					{
						if($scope.curStar[i]==true)
						{
							len++;
						}
					}
					if(len==0)
					{
						for(var i=0;i<=index;i++)
						{
							$scope.hoverStar[i]=false;
						}
					}
				}
				
				$scope.starClick=function(index){
					var len=0;
					for(var i=0;i<$scope.curStar.length;i++)
					{
						if($scope.curStar[i]==true)
						{
							len++;
						}
					}
					if(len==0)
					{
						publishScore(index+1);
					}else
					{
						alert("您已经评分过了，不能再次评分");
					}
				}
				
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
				 		alert("没有更多啦")
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
								listInfoCom($scope.VM.resourceId,$localStorage.fromFlag);
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
								listInfoCom($scope.VM.resourceId,$localStorage.fromFlag);
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
					listInfoCom(id,$localStorage.fromFlag);
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
						listInfoCom($scope.allSourceList[$scope.currentSlideIndex-1].id,$localStorage.fromFlag);
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
						listInfoCom($scope.allSourceList[$scope.currentSlideIndex+1].id,$localStorage.fromFlag);
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
				
				 
				 	//获取单个资源的详细信息/评论
				function listInfoCom(id,fromFlag){
					$scope.VM.resourceId=id;
					Preview.listInfo({
					resId: id,
					fromFlag:fromFlag

					}, function(data) {
						if(data.code=="OK")
						{
							console.log(data.data)
							$scope.info = data.data;
							for (var i = 0; i < $scope.info.score; i++) {
								//几颗星亮
								$scope.curStar[i]=true;
							}
						}else
						{
							alert(data.code);
						}
						
					});
					//获取播放链接
					Preview.resViewUrl({
						resIds: id,
						fromFlags:fromFlag

					}, function(data) {
						if(data.code=="OK")
						{
							console.log(data);
							var tpl="";
							tpl = "<iframe width='100%' height='700px' src='" + data.data[0].path + "' style='border:0'></iframe>"
							$('#res-slide-content').html(tpl);
						}else
						{
							alert(data.code);
						}
						
					});
					//获取对应评论
					getComment(id); 
				}
				
				//获取所有评论
				$scope.userName = $localStorage.authUser.userName;
				function getComment(id) {
					Preview.myComment({
						resId: id,
						fromFlag: $localStorage.fromFlag,
					}, function(data) {
						
						if(data.code=="OK")
						{
							$scope.myCommentList = data.data;
						}else{
							alert(data.message);
						}
						
					});
					//获取其他人的评论
					Preview.otherComment({
							resId: id,
							fromFlag: $localStorage.fromFlag,
						}, function(data) {
							if(data.code=="OK")
							{
								$scope.otherCommentList = data.data;
							}else{
								alert(data.message);
							}
					});
					
				}
				
				//评论限制操作
				$scope.commentNum = 200;
				$scope.inputComment = "";
				$scope.changeComment = function() {
					if ($scope.inputComment.length < 201) {
						$scope.commentNum = 200 - $scope.inputComment.length;
					} else {
						$scope.inputComment = $scope.inputComment.substring(0,200);
					}
				}
				
				$scope.myShow=true;
				$scope.otherShow=false;
				$scope.changeBlock=function(obj){
					if(obj=="my")
					{
						$scope.myShow=true;
						$scope.otherShow=false;
						
					}else{
						$scope.myShow=false;
						$scope.otherShow=true;
					}
				}

				//发布评论
					$scope.publishComment = function() {
						var score=0;
						_.each($scope.curStar, function(v, i) {
							if($scope.curStar[i]==true)
							{
								score++;
							}
						});
						
						if(score==0)
						{
							alert("评完分才能评论哦！");
							return false;
						}
						Preview.editComment({
							resId: $scope.VM.resourceId,
							displayContent: $scope.inputComment,
							fromFlag: $localStorage.fromFlag,
							ascore: score,
							isScore: 1
						}, function(data) {
							if(data.code=="OK")
							{
								getComment($scope.VM.resourceId); //获取我的评论
								$scope.inputComment="";
							}else{
								alert(data.message);
							}
						});
					}
				//发布评分
				 function publishScore(index) {
				 	console.log(index)
						Preview.editComment({
							resId: $scope.VM.resourceId,
							displayContent: "",
							fromFlag: $localStorage.fromFlag,
							ascore: index,
							isScore: 0
						}, function(data) {
							if(data.code=="OK")
							{
								for(var i=0;i<index;i++)
								{
									$(".comment-star .icon-star").eq(i).addClass("starLight");
								}
							}else{
								alert(data.message);
							}
						});
				}
				
				
				//删除评论
				$scope.deleteCom=function(id){
					Preview.editComment({
						commentId:id,
						_method:"PATCH"
					}, function(data) {
						console.log(data)
						if(data.code=="OK")
						{
							getComment($scope.VM.resourceId); //获取我的评论
						}else
						{
							alert(data.message);
						}
					});	
					
				}
				//编辑评论
				$scope.editCom=function(id,content){
					$("#editModel").modal("show");
					$("#editContent").val(content);
					$scope.editSure=function(){
						Preview.editComment({
						displayContent: $("#editContent").val(),
						commentId:id,
						_method:"PATCH"
						}, function(data) {
							if(data.code=="OK")
							{
								getComment($scope.VM.resourceId); //获取我的评论
								$("#editModel").modal("hide");
								
							}else
							{
								alert(data.message);
							}
							
						});		
					}
					//取消
					$scope.offModal=function(){
						$("#editModel").modal("hide");
					}
				}
				

			}
		])
}());