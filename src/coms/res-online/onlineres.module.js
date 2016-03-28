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
						url: '/onlineres',
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
								templateUrl: '/coms/layout/footer/footer.html'
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
		.controller("OnlineResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes','$http',
			function($scope, $stateParams, $state, $location,SystemRes,$http) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				$scope.slides = [
				{
					title: "荷塘月色-课件1",
					type:'img',
					src: "http://7xpwjy.com1.z0.glb.clouddn.com/780700105_20160224113433.png"
				},{
					title: "荷塘月色-图片",
					type:'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				},{
					title: "荷塘月色-pdf",
					type:'media',
					src: "http://m.tfedu.net/book/ereader/"
				},{
					title: "荷塘月色-多媒体",
					type:'img',
					src: "http://7xpwjy.com1.z0.glb.clouddn.com/780700105_20160224113433.png"
				}]
				
				$scope.selectRes = function(index) {
					var tpl = '';
					switch($scope.slides[index].type)
					{
					case "img":
					  tpl = "<img src='" +$scope.slides[index].src + "' />"
					  $('#res-slide-content').html(tpl);
					  break;
					case "pdf":
					  tpl = "<iframe width='100%' height='700px' src='" +$scope.slides[index].src + "' ></iframe>"
					  $('#res-slide-content').html(tpl);
					  break;
					case "media":
					  tpl = "<iframe width='100%' height='700px' src='" +$scope.slides[index].src + "' ></iframe>"
					  $('#res-slide-content').html(tpl);
					  break;
					default:
					   tpl = "<img src='" +$scope.slides[0].src + "' />"
					  $('#res-slide-content').html(tpl);
					}
				}
			}
		])
}());