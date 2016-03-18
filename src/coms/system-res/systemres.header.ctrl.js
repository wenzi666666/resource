/**
 * 系统资源 header controller
 */
(function() {
	'use strict';

	angular.module('webApp.coms.systemres')
		.controller("SystemResHeaderController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				// 变量
				$scope.Select.grade = ["小学","初中","高中"];
				$scope.Select.subject = ["语文","数学","英语","物理","化学","生物","地理","政治","信息技术"];
				$scope.Select.version = ["课标版","北师大版本","人教版","鲁教版","苏科版","粤教版","华东师大版本"];
			    $scope.Select.material = ["必修1","必修2","必修3","必修4","必修5","必修6"];
			    //学段控制
			    $scope.Select.currentGrade = $scope.Select.grade[1];
			    $scope.Select.currentGradeSeclet = [];
			    $scope.Select.currentGradeSeclet[1] = true;
			    $scope.Select.selectGrade = function(index){
			    	$scope.Select.currentGrade = $scope.Select.grade[index];
			    	//选中
			    	_.each($scope.Select.grade,function(v,i){
			    		$scope.Select.currentGradeSeclet[i] = false;
			    	})
			    	$scope.Select.currentGradeSeclet[index] = true;
			    	
			    	$scope.Select.currentVersionShow = false;
					$scope.Select.currentMaterialShow = false;
					
			    }
			    
			    //学科控制
			    $scope.Select.currentSubject = $scope.Select.subject[0];
			    $scope.Select.currentSubjectSeclet = [];
			    $scope.Select.currentSubjectSeclet[0] = true
			    $scope.Select.selectSubject = function(index){
			    	$scope.Select.currentSubject = $scope.Select.subject[index];
			    	//选中
			    	_.each($scope.Select.subject,function(v,i){
			    		$scope.Select.currentSubjectSeclet[i] = false;
			    	})
			    	$scope.Select.currentSubjectSeclet[index] = true;
			    	
			    	$scope.Select.currentVersionShow = false;
					$scope.Select.currentMaterialShow = false;
			    }
			    
			    // 版本
			    setTimeout(function(){
			    	$('.res-material-content').eq(0).addClass('selected')
			    },100)
			    $scope.Select.currentVersion = $scope.Select.version[0];
			    $scope.Select.currentVersionTmpShow = true;
			    $scope.Select.selectVersion = function(index){
			    	$scope.Select.currentVersion = $scope.Select.version[index];
			    	$scope.Select.currentVersionShow = true;
			    	
			    	//隐藏学科学段
			    	$scope.Select.currentHeader = true;
			    	$scope.Select.currentVersionTmpShow = false;
			    }
			    
			    // 教材
			    $scope.Select.selectMaterial = function(index){
			    	$scope.Select.currentMaterial = $scope.Select.material[index];
			    	$scope.Select.currentMaterialShow = true;
			    }	
			}
		])
}());