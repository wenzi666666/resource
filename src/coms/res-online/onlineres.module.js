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
					total: {method: "GET",url: window.BackendUrl + "/api/discuss/home/total"}
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
				Prepare.baseGetApi({
					tfcode: $localStorage.currentTreeNode.tfcode
				}, function(data) {
					$scope.prepare = data.data[0];
					console.log("prepare:", $scope.prepare)
				})
				// 读取 单个备课夹详细内容
				var getPrepareDetails = function(id,index) {
					Prepare.prepareContent({
						id: id
					}, function(data) {
						$scope.slides = data.data;
						$scope.getResPlayUrl(0,$scope.slides[0].resId)
						slideToolsInit();
						console.log(data.data)
					})
				}
				getPrepareDetails($stateParams.prepareId);
				
				// 获取 播放链接
				$scope.getResPlayUrl = function(index,id) {
					console.log(index,id)
					Preview.resViewUrl({
						resIds: id,
						fromFlags:$localStorage.fromFlag
					}, function(data){
						$scope.slides[index].src = data.data[0].path;
						$scope.selectRes(index);
						console.log(data.data)
					})
				}
					
				//上一个
				var currentSlideIndex = 0;
				$scope.slidePre = function() {
					if(currentSlideIndex > 0) {
						currentSlideIndex--;
						$scope.selectRes(currentSlideIndex);
						$scope.getResPlayUrl(currentSlideIndex, $scope.slides[currentSlideIndex].resId);
					}else{
						currentSlideIndex = $scope.slides.length-1;
					}
					
				}
				
				//下一个
				$scope.slideNext = function() {
					if(currentSlideIndex < $scope.slides.length-1) {
						currentSlideIndex++;
						$scope.selectRes(currentSlideIndex);
						$scope.getResPlayUrl(currentSlideIndex, $scope.slides[currentSlideIndex].resId);
					}else{
						currentSlideIndex = 0;
					}
				}
				
				//跳转到
				$scope.selectRes = function(index) {
					var tpl = '';
					switch($scope.slides[index].type)
					{
					default:
					   tpl = "<iframe width='100%' height='700px' src='" +$scope.slides[index].src + "' style='border:0'></iframe>"
					   $('#res-slide-content').html(tpl);
					}
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
				$scope.toggleFullscreen = function() {
					if (screenfull.enabled) {
					    screenfull.toggle($('.slide-container')[0]);
					    
					    if(screenfull.isFullscreen) {
				        	$scope.VM.slideTools = true;
				        	
				        }else{
				        	$scope.VM.slideTools = false;
				        }
					}
				}				
			}
		])
}());