/**
 * 共用header footer 及导航
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.layout')
		.factory('Layout', ['$resource',
			function($resource) {
				return $resource('', {}, {
					// 学习空间
					autoLearning: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/autoLearning"
					},
					// 获取用户信息
					getUserInfo: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/users/:id",
						params: {
							id: '@id'
						}
					},
				})
			}
		])
		.controller("LayoutController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','Layout','ModalMsg',
			function($scope, $stateParams, $state, $location,$localStorage,Layout,ModalMsg) {
				//主导航学生学习空间地址
				var spaceNavUrl = '';
				$scope.goToSpace = function(){
					Layout.autoLearning({},function(data) {
						if (data.code == "OK") {
							spaceNavUrl = data.data;
							openwin(spaceNavUrl)
						}
					})
				}
				
				//退出
				$scope.logout = function() {
					localStorage.removeItem("ngStorage-authUser");
					localStorage.removeItem("credentialsToken");
//					localStorage.removeItem("ngStorage-currentGrade");
//					localStorage.removeItem("ngStorage-currentMaterial");
//					localStorage.removeItem("ngStorage-currentSubject");
//					localStorage.removeItem("ngStorage-currentTreeNode");
//					localStorage.removeItem("ngStorage-currentVersion");
					window.location.href= "login.html";
				}
				// 显示用户信息
				if(!$localStorage.authUser){
					Layout.getUserInfo({
						id:window.getSeachByName('userId')
					}, function(data){
						console.log(data);
						$localStorage.authUser = data.data;
						$scope.userTrueName = $localStorage.authUser.trueName;
					})
				} else if(window.getSeachByName('userId') && $localStorage.authUser.userId != window.getSeachByName('userId') ){
					Layout.getUserInfo({
						id:window.getSeachByName('userId')
					}, function(data){
						console.log(data);
						$localStorage.authUser = data.data;
						$scope.userTrueName = $localStorage.authUser.trueName;
					})
				} else {
					$scope.userTrueName = $localStorage.authUser.trueName;
				}
				
				
				// 导航激活
				$scope.isActive = function (viewLocation) {
				     return (viewLocation === $state.current.name);
				};
				// 根据state状态 切换 页面 logo
				$scope.pageLogo = $state.current.name;
				switch($state.current.name)
				{
					case "message":
					  $scope.pageTitle = "消息中心";
					  break;
					case "help":
					  $scope.pageTitle = "帮助中心";
					  break;
					case "settings":
					  $scope.pageTitle = "个人设置";
					  break;
					case "prepare":
					  $scope.pageTitle = "备课夹";
					  break;
					case "search":
					  $scope.pageTitle = "搜索结果";
					  break;	
				}
				
				// 返回顶部
				$scope.goToTop = function() {
					console.log("top")
					$("html, body").animate({scrollTop:0},"slow");
				}
				// header隐藏
				setTimeout(function() {
					var header = document.querySelector("#banner");
					var headerTop = document.querySelector("#header-top");
					var mainNav = document.querySelector("#main-nav");
					if(!!header) {
						 if(window.location.hash) {
					      header.classList.add("slide--up");
					    }
					
					    new Headroom(header, {
					        tolerance: {
					          down : 10,
					          up : 20
					        },
					        offset : 300,
					        classes: {
					          initial: "slide",
					          pinned: "slide--reset",
					          unpinned: "slide--up"
					        }
					    }).init();
					}
					
					if(!!headerTop) {
						 if(window.location.hash) {
					      headerTop.classList.add("slide--up");
					    }
					
					    new Headroom(headerTop, {
					        tolerance: {
					          down : 10,
					          up : 20
					        },
					        offset : 300,
					        classes: {
					          initial: "slide",
					          pinned: "slide--reset",
					          unpinned: "slide--up"
					        }
					    }).init();
					}
					
					if(!!mainNav) {
						 if(window.location.hash) {
					      mainNav.classList.add("slide--up");
					    }
					
					    new Headroom(mainNav, {
					        tolerance: {
					          down : 10,
					          up : 20
					        },
					        offset : 300,
					        classes: {
					          initial: "slide",
					          pinned: "slide--reset",
					          unpinned: "main-nav--up"
					        }
					    }).init();
					}
				},500)
			}
		])
}());