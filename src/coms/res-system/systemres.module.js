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
		.controller("SystemResController", ['$scope', '$stateParams', '$state', '$location', 'SystemRes','Prepare','$localStorage','ModalMsg',
			function($scope, $stateParams, $state, $location,SystemRes,Prepare,$localStorage,ModalMsg) {
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
						var flyer = $('<img class="u-flyer" style="max-width:150px" src="'+img.attr('src')+'">');
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
				
				// 监听 目录树 选择
				$scope.$on("currentTreeNodeChange", function(e, d) {
					console.log(d)
					
				})
				
				// 读取备课夹 列表
				var getPrepare = function(id) {
					Prepare.baseGetApi({
						tfcode: id
					}, function(data) {
						console.log(data.data);
						$scope.prepareList = data.data;
						
					})
				}
				setTimeout(function(){
					getPrepare($localStorage.currentTreeNode.tfcode)
				}, 3000)
				//将资源加入备课夹
				$scope.addToPrepare = function(index) {
					Prepare.addResToPrepareId({
						id: $scope.prepareList[index].id,
						resIds: '4319500105',
						fromFlags: 0
					}, function(data) {
						console.log(data);
						ModalMsg.logger("加入备课夹成功！")
						
					})
				}
			}
		])
}());