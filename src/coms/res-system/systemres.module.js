/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.systemres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('systemres', {
						url: '/systemres',
						views: {
							'content@': {
								templateUrl: '/coms/res-system/views/systemres.html',
								controller: 'SystemResController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('SystemRes', ['$resource',
			function($resource) {
				return $resource(window.BackendUrl+"/resRestAPI/v1.0/users/:userid",{
                    userid: '@_id'
                },{
					getUser: {method: "GET",url: window.BackendUrl + "/resRestAPI/v1.0/users/"}
				})
			}
		])
		.controller("SystemResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes','$http','$localStorage',
			function($scope, $stateParams, $state, $location,SystemRes,$http,$localStorage) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				// 关闭版本筛选
				$scope.closeCurrentVersion = function() {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
				}
				// list切换
				$scope.isList = true;
				
				
			    $scope.switchList = function(list){
			    	$scope.isList = list;
			    }
			    
  			    $scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
				
				// 加入备课夹 动画
				setTimeout(function() {
					$(".addPrepare").click(function(event){
						
						var addcar = $(this);
						var offset = $(".shopping-cart").offset();
//						console.log(offset.left,offset.top)
						
						var img = addcar.parent().parent().find('.res-list-thumb');
						var flyer = $('<img class="u-flyer" src="'+img.attr('src')+'">');
						flyer.fly({
							start: {
								left: img.offset().left,
								top:  event.clientY-30
							},
							end: {
								left: offset.left+200,
								top: offset.top-200,
								width: 0,
								height: 0
							},
							onEnd: function(){
//								$("#msg").show().animate({width: '250px'}, 200).fadeOut(1000);
//								addcar.css("cursor","default").removeClass('orange').unbind('click');
								$('.u-flyer').remove(); //移除dom
							}
						});
					});
				}, 3000)
				
				
				

				
			}
		])
}());