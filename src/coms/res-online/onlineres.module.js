/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.onlineres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('onlineres', {
						url: '/onlineres/:prepareId',
						views: {
							'content@': {
								templateUrl: '/coms/res-online/views/onlineres.html',
								controller: 'OnlineResController'
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
		.factory('OnlineRes', ['$resource',
			function($resource) {
				return $resource('', {}, {
					total: {method: "GET",url: window.TomcatUrl + "/api/discuss/home/total"}
				})
			}
		])
		.controller("OnlineResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes','$http','Prepare','Preview','$localStorage','ModalMsg',
			function($scope, $stateParams, $state, $location,SystemRes,$http, Prepare,Preview,$localStorage,ModalMsg) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};	
				
				//slide下方导航默认不显示
				$scope.VM.slideTools = false;
				$scope.currentTreeNode = $localStorage.currentTreeNode;
				$scope.currentPrepare = $localStorage.currentPrepare;
//				Prepare.baseGetApi({
//					tfcode: $localStorage.currentTreeNode.tfcode
//				}, function(data) {
//					$scope.prepare = data.data[0];
//					console.log("prepare:", $scope.prepare)
//				})
				// 读取 单个备课夹详细内容
				var getPrepareDetails = function(id,index) {
					Prepare.prepareContent({
						id: id
					}, function(data) {
						$scope.slides = data.data;
						$scope.getResPlayUrl(0,$scope.slides[0].resId,$scope.slides[0].fromFlag)
						slideToolsInit();
						console.log(data.data)
					})
				}
				getPrepareDetails($stateParams.prepareId);
				
				// 获取 播放链接
				$scope.getResPlayUrl = function(index,id, flag) {
					console.log(index,id)
					Preview.resViewUrl({
						resIds: id,
						fromFlags:flag
					}, function(data){
						$scope.slides[index].src = data.data[0].path;
						$scope.selectRes(index);
						console.log(data.data);
						currentSlideIndex = index;
					})
				}
					
				//上一个
				var currentSlideIndex = 0;
				$scope.slidePre = function() {
					if(currentSlideIndex > 0) {
						currentSlideIndex--;
						$scope.selectRes(currentSlideIndex);
						$scope.getResPlayUrl(currentSlideIndex, $scope.slides[currentSlideIndex].resId,$scope.slides[currentSlideIndex].fromFlag);
					}else{
						currentSlideIndex = $scope.slides.length-1;
					}
					
				}
				
				//下一个
				$scope.slideNext = function() {
					if(currentSlideIndex < $scope.slides.length-1) {
						currentSlideIndex++;
						$scope.selectRes(currentSlideIndex);
						$scope.getResPlayUrl(currentSlideIndex, $scope.slides[currentSlideIndex].resId,$scope.slides[currentSlideIndex].fromFlag);
					}else{
						currentSlideIndex = 0;
					}
				}
				
				//跳转到
				$scope.curImg = [];
				$scope.curImg[0]=true;
				$scope.selectRes = function(index) {
					var tpl = '';
					switch($scope.slides[index].type)
					{
					default:
					   tpl = "<iframe width='100%' height='700px' src='" +$scope.slides[index].src + "' style='border:0'></iframe>"
					   $('#res-slide-content').html(tpl);
					}
					for(var i=0;i<$scope.slides.length;i++)
					{
						$scope.curImg[i]=false;
					}
					$scope.curImg[index]=true;
				}
				
				// 下方工具栏 
				var slideIndex = 0;
				var slidePerpage = 6;
				// 初始化 
				var slideToolsInit = function() {
					if($scope.slides.length >6) {
						$scope.slidesCustom = $scope.slides.slice(slideIndex, slidePerpage);
					} else{
						$scope.slidesCustom = $scope.slides
					}
				}

				// 向前
				$scope.slidePreCustom = function() {
					if(slideIndex >= slidePerpage) {
						slideIndex -= slidePerpage;
						$scope.slidesCustom = $scope.slides.slice(slideIndex, slideIndex+slidePerpage);
						
					}
						
				}
				// 向后
				$scope.slideNextCustom = function() {
					console.log("next:",slideIndex, slidePerpage,$scope.slides.length)
					if(slideIndex + slidePerpage < $scope.slides.length) {
						slideIndex += slidePerpage;
						$scope.slidesCustom = $scope.slides.slice(slideIndex, slideIndex+slidePerpage);
						
					}
						
				}
				
				// 全屏切换
//				var $container = $('.slide-container');
//				var $slideContent = $('.slide-content');
				$scope.toggleFullscreen = function() {
					openwin($scope.slides[currentSlideIndex].src)
//					console.log(screenfull.isFullscreen)
//					if (screenfull.enabled) {
//					    screenfull.toggle($container[0]);
//					    
//					    if(screenfull.isFullscreen) {
//				        	$scope.VM.slideTools = true;
//				        	$container.css({
//				        		'width': "100%",
//				        		'height':"100%"
//				        	});
//				        	$slideContent.css('height', "75%");
//				        }else{
//				        	$scope.VM.slideTools = false;
//				        	$container.css({
//				        		'width': '',
//				        		'height':"700px"
//				        	})
//				        	$slideContent.css('height', "700px");
//				        }
//					}
				}
				
//				$scope.toggleSlideTools = function() {
//				    $scope.$apply(function() {
//						$scope.VM.slideTools = false;
//						$container.css({
//				        	'width':'',
//				        	'height':"700px"
//				        })
//						$slideContent.css('height', "700px");
//					})
//				}
//				
//				// 监听 按键
//				$(document).keyup(function(event){
//
//					switch(event.keyCode) {
//						case 27:{
//							$scope.toggleSlideTools();
//							break;
//						}	
//						case 96:
////						 	$scope.toggleSlideTools();
//						 	break;
//					}
//				})
			}
		])
}());