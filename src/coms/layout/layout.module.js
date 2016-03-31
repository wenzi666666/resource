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
					userid: JSON.parse(localStorage.getItem("auth_user")).userId
				}, function(data){
					$localStorage.authUser = data.data;
				})
				$scope.logout = function() {
					localStorage.removeItem("auth_user");
					localStorage.removeItem("credentialsToken");
					window.location.href= "login.html";
				}
			}
		])
}());