/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.message')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('message', {
						url: '/message',
						views: {
							'content@': {
								templateUrl: '/coms/message/views/message.html',
								controller: 'MessageController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header3.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html',
								controller: 'LayoutController'
							}
						}
					})
			}
		])
		.factory('Message', ['$resource', 
			function($resource) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: TomcatUrl + "/api/discuss/home/total"
					},
					userMessage: { //查询自己评论
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/message"
					}
				})
			}
		])
		.controller("MessageController", ['$scope', '$stateParams', '$state', '$location','Message', 
			function($scope, $stateParams, $state, $location,Message) {
				// 变量共享
				$scope.VM = {};
				
				/*获取消息*/
//				Message.userMessage({},function(data){
//					console.log(data)
//				});
				$scope.messageList=[];
				$scope.messageList=[{
//					"type":"系统消息",
//					"time":"1460948698000",
//					"content":"系统将于2016年4月18日进行维护"
//				},
//				{
//					"type":"个人消息",
//					"time":1460948698000,
//					"content":"系统将于2016年4月18日进行维护"
//				},{
//					"type":"系统消息",
//					"time":1460948698000,
//					"content":"啦啦啦阿联啦啦啦拉开阿拉蕾阿里啦啦拉开阿拉蕾阿里啦啦拉开阿拉蕾阿里啦啦拉开阿拉蕾阿里啦啦拉开阿拉蕾阿里啦啦拉开阿拉蕾阿里 啦啦拉开阿拉蕾阿里 奥拉鲁啊啊拉开拉链阿里阿"
//				},{
//					"type":"个人消息",
//					"time":1460948698000,
//					"content":"系统将于2016年4月18日进行维护"
//				},{
//					"type":"系统消息",
//					"time":1460948698000,
//					"content":"系统将于2016年4月18日进行维护"
				}];
				
				$scope.bigCurrentPage=1;
				$scope.bigTotalItems=2;
				$scope.maxSize=3;
				$scope.pageChanged = function(pagenum) {
					console.log(pagenum);
					if(pagenum == undefined) {
						console.log('Page changed to: ' + $scope.VM.currentPageCtrl);
					}
					else {
						console.log('Page changed to: ' + page);
						$scope.bigCurrentPage = pagenum;
					   
					} 
				};
				$scope.pageTo=$scope.bigCurrentPage;
				
			}
		])
}());