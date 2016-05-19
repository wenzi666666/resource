/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.help')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('help', {
						url: '/help',
						views: {
							'content@': {
								templateUrl: '/coms/help/views/help.html',
								controller: 'HelpController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header3.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('Help', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: TomcatUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("HelpController", ['$scope', '$stateParams', '$state', '$location',
			function($scope, $stateParams, $state, $location) {
				// 变量共享
				$scope.VM = {};
				// 切换导航栏
				$scope.VM.nav=true;
				$scope.VM.help="active";
				$scope.VM.service="";
				$scope.switchNav = function(obj) {
					if(obj=="help")
					{
						$scope.VM.nav = true;
						$scope.VM.help="active";
						$scope.VM.service="";
						
					}else
					{
						$scope.VM.nav = false;
						$scope.VM.service="active";
						$scope.VM.help="";
					}
						
				}
				
				$(".help_list .help_title").on("click",function(){
					if($(this).next().css("display")=="none")
					{
						$(".help_list .help_content").hide();
						$(this).next().slideDown(300);
					}else{
						$(this).next().slideUp(300);
					}
					
				});

			}
		])
}());