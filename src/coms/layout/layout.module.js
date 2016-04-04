/**
 * 共用header footer 及导航
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.layout')
		.factory('UserInfo', ['$resource',
			function($resource) {
				return $resource(window.BackendUrl+"/resRestAPI/v1.0/users/:userid",{
                    userid: '@_id'
                },{
					getUser: {method: "GET",url: window.BackendUrl + "/resRestAPI/v1.0/users/"}
				})
			}
		])
		.controller("LayoutController", ['$scope', '$stateParams', '$state', '$location', 'UserInfo','$localStorage',
			function($scope, $stateParams, $state, $location,UserInfo,$localStorage) {
				//初始化用户信息
				UserInfo.get({
					userid: $localStorage.authUser.userId
				}, function(data){
//					$localStorage.authUser = data.data;
				})
				$scope.logout = function() {
					localStorage.removeItem("auth_user");
					localStorage.removeItem("credentialsToken");
					window.location.href= "login.html";
				}
				
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
			}
		])
}());