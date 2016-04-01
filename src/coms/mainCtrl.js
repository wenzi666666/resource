angular.module('webApp')
	.controller("MainCtrl", ['$scope', '$rootScope', '$window', '$localStorage',
	function($scope, $rootScope, $window,  $localStorage) {
		// 监听 目录树更改
		$scope.$on("currentTreeId",function(e, d) {
			$scope.$broadcast('currentTreeIdUpdate', d);		
		})
	}]);