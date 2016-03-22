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
								templateUrl: '/coms/preview-res/views/previewres.html',
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
				$scope.Select = {};
				
				// 关闭版本筛选
				$scope.closeCurrentVersion = function() {
					$scope.Select.currentVersionShow = false;
					$scope.Select.currentMaterialShow = false;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.Select.currentMaterialShow = false;
				}
				// list切换
				$scope.isList = true;
				
				
			    $scope.switchList = function(list){
			    	$scope.isList = list;
			    }
				
				// 轮播
				  var slides = $scope.slides = [];
				  var currIndex = 0;
				
				  $scope.addSlide = function() {
				    var newWidth = 600 + slides.length + 1;
				    slides.push({
				      image: 'http://lorempixel.com/' + newWidth + '/300',
				      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
				      id: currIndex++
				    });
				  };
				  
				   $scope.addSlide();
				   $scope.addSlide();
				   $scope.addSlide();
			}
		])
}());