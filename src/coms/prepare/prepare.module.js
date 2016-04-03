/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.prepare')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('prepare', {
						url: '/prepare',
						views: {
							'content@': {
								templateUrl: '/coms/prepare/views/prepare.html',
								controller: 'PrepareController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header4.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('Prepare', ['$resource',
			function($resource) {
				return $resource( BackendUrl+"/resRestAPI/v1.0/prepare/:id",{
                    id: '@_id'
                },{
					getPrepareByTfcode: {method: "GET",url: BackendUrl + "/resRestAPI/v1.0/prepare/"}
				})
			}
		])
		.controller("PrepareController", ['$scope', '$stateParams', '$state', '$location', 'Prepare',
			function($scope, $stateParams, $state, $location,Prepare) {
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
			    
			     $scope.maxSize = 3;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
			    
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
			    
			    var getPrepare = function(id) {
			    	Prepare.getPrepareByTfcode({
			    		tfcode: id
			    	}, function(data) {
			    		console.log(data.data)
			    	})
			    }
			    
				
				// 监听 目录树 选择
				$scope.$on("currentTreeTFCodeChange", function(e, d) {
					getPrepare(d);
				})
			}
		])
}());