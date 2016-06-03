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
						url: TomcatUrl + "/resRestAPI/v1.0/autoLearning"
					},
					// 获取用户信息
					getUserInfo: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/users/:id",
						params: {
							id: '@id'
						}
					},
					// 情景英语
					sceneEnglish: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/additional/sceneEnglish"
					},
					// 题库
					questionLibrary: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/additional/questionLibrary"
					}
				})
			}
		])
		.controller("LayoutController", ['$scope', '$stateParams', '$state', '$location', '$localStorage','Layout','ModalMsg',
			function($scope, $stateParams, $state, $location,$localStorage,Layout,ModalMsg) {
				//主导航学生学习空间地址
				var spaceNavUrl = '';
				Layout.autoLearning({},function(data) {
					if (data.code == "OK") {
						spaceNavUrl = data.data;
							
					} else {
						if(data.code == "KickOutTokenException") {
							ModalMsg.logger(data.message);
							setTimeout(function(){
								$scope.logout();
							}, 2000)
						}else{
							$scope.logout();
						}
					}
				})
				$scope.goToSpace = function(){
					openwin(spaceNavUrl)
				}
				// 跳转到备课夹，用click事件，去以清除 hover返回时还选中
				$scope.goToPrepare = function(){
					openwin('/prepare')
				}
				// 情景英语
				$scope.goToSceneEnglish = function(){
					Layout.sceneEnglish({},function(data) {
						openwin(data.data)
					})
				}
				// 题库
				$scope.goToQuestionLibrary = function(){
					Layout.questionLibrary({},function(data) {
						openwin(data.data)
					})
				}
				//退出
				$scope.logout = function() {
					localStorage.removeItem("ngStorage-authUser");
					localStorage.removeItem("credentialsToken");
					localStorage.removeItem("ngStorage-currentGrade");
					localStorage.removeItem("ngStorage-currentMaterial");
					localStorage.removeItem("ngStorage-currentSubject");
					localStorage.removeItem("ngStorage-currentTreeNode");
					localStorage.removeItem("ngStorage-currentVersion");
					window.location.href= "login.html";
				}
				// 显示用户信息
				if(!$localStorage.authUser){
					Layout.getUserInfo({
						id:window.getSeachByName('userId')
					}, function(data){
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
					case "systemres":
					  $scope.pageTitle = "系统资源";
					   break;
					case "schoolres":
					  $scope.pageTitle = "校本资源";
					   break;
					case "areares":
					  $scope.pageTitle = "区本资源";
					   break;
					case "customres":
					  $scope.pageTitle = "资源定制";
					  break;
					case "previewres":
					  $scope.pageTitle = "资源预览";
					  break;
					case "onlineres":
					  $scope.pageTitle = "在线授课";
					  break;
					case "personalcenter":
					  $scope.pageTitle = "个人中心";
					  break;	
					default:
						$scope.pageTitle = "资源中心";
				}
				 document.title = $scope.pageTitle;
				
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