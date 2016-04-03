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
						url: '/previewres',
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
		.factory('PreviewRes', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("PreviewResController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				//slide下方导航默认不显示
				$scope.VM.slideTools = false;
				
				$scope.slides = [
				{
					title: "荷塘月色-课件1",
					type:'img',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-pdf",
					type:'media',
					src: "http://m.tfedu.net/book/ereader/"
				},{
					title: "荷塘月色-案例",
					type:'html',
					src: "http://101.200.190.27:8099/down/dec/00ae9e79-a560-4e23-bf01-609c711666ec-274/index.htm"
				}]
				
				//上一个
				var currentSlideIndex = 3;
				$scope.slidePre = function() {
					if(currentSlideIndex > 0) {
						$scope.selectRes(currentSlideIndex-1);
					}else{
						currentSlideIndex = $scope.slides.length-1;
					}
				}
				//下一个
				$scope.slideNext = function() {
					if(currentSlideIndex < $scope.slides.length-1) {
						$scope.selectRes(currentSlideIndex+1);
					}else{
						currentSlideIndex = 0;
					}
				}
				
				//跳转到
				$scope.selectRes = function(index) {
					var tpl = '';
					currentSlideIndex = index;
					switch($scope.slides[index].type)
					{
//					case "img1":
//					  tpl = "<img src='" +$scope.slides[index].src + "' />"
//					  $('#res-slide-content').html(tpl);
//					  break;
					default:
					   tpl = "<iframe width='100%' height='700px' src='" +$scope.slides[index].src + "' style='border:0'></iframe>"
					   $('#res-slide-content').html(tpl);
					}
				}
				
				$scope.selectRes(0);
			}
		])
}());