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
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("HelpController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};
				
				// 关闭版本筛选
				$scope.closeCurrentVersion = function() {
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					$scope.VM.isList = true;
				}
				// 关闭教材筛选
				$scope.closeCurrentMaterial = function() {
					$scope.VM.currentMaterialShow = false;
				}
				// list切换
				$scope.isList = true;
				
				
			    $scope.switchList = true;
			    
			    
			    // 备课夹 临时数据
			    $scope.switch = function(index){
			    	_.each($scope.listData, function(v,i){
			    		$scope.listData[i].active = false
			    	})
			    	$scope.listData[index].active = true
			    }
			    $scope.listData = [{
			    	title: "荷塘月色",
			    	active: true,
			    	date: "一周内",
			    	children:[{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	}]
			    },{
			    	title: "荷塘月色",
			    	date: "一周内",
			    	children:[{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	}]
			    },{
			    	title: "荷塘月色",
			    	date: "一周内",
			    	children:[{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	}]
			    },{
			    	title: "荷塘月色",
			    	date: "一周内",
			    	children:[{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	}]
			    },{
			    	title: "荷塘月色",
			    	date: "一周内",
			    	children:[{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	}]
			    },{
			    	title: "荷塘月色",
			    	date: "一周内",
			    	children:[{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	},{
			    		title: "荷塘月色-课件1",
			    		type: "动画",
			    		size: "15M"
			    	}]
			    }]
			    
				
			}
		])
}());