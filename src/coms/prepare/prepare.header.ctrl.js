/**
 * 系统资源 header controller
 */
(function() {
	'use strict';

	angular.module('webApp.coms.prepare')
		.controller("PrepareHeaderController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				// 变量
				$scope.VM.grade = ["小学","初中","高中"];
				$scope.VM.subject = ["语文","数学","英语","物理","化学","生物","地理","政治","信息技术"];
				$scope.VM.version = ["课标版","北师大版本","人教版","鲁教版","苏科版","粤教版","华东师大版本"];
			    $scope.VM.material = ["必修1","必修2","必修3","必修4","必修5","必修6"];
			    //学段控制
			    $scope.VM.currentGrade = $scope.VM.grade[1];
			    $scope.VM.currentGradeSeclet = [];
			    $scope.VM.currentGradeSeclet[1] = true;
			    $scope.VM.selectGrade = function(index){
			    	$scope.VM.currentGrade = $scope.VM.grade[index];
			    	//选中
			    	_.each($scope.VM.grade,function(v,i){
			    		$scope.VM.currentGradeSeclet[i] = false;
			    	})
			    	$scope.VM.currentGradeSeclet[index] = true;
			    	
			    	$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					
			    }
			    
			    //学科控制
			    $scope.VM.currentSubject = $scope.VM.subject[0];
			    $scope.VM.currentSubjectSeclet = [];
			    $scope.VM.currentSubjectSeclet[0] = true
			    $scope.VM.selectSubject = function(index){
			    	$scope.VM.currentSubject = $scope.VM.subject[index];
			    	//选中
			    	_.each($scope.VM.subject,function(v,i){
			    		$scope.VM.currentSubjectSeclet[i] = false;
			    	})
			    	$scope.VM.currentSubjectSeclet[index] = true;
			    	
			    	$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
			    }
			    
			    // 版本
			    setTimeout(function(){
			    	$('.res-material-content').eq(0).addClass('selected')
			    },100)
			    $scope.VM.currentVersion = $scope.VM.version[0];
			    $scope.VM.currentVersionTmpShow = true;
			    $scope.VM.selectVersion = function(index){
			    	$scope.VM.currentVersion = $scope.VM.version[index];
			    	$scope.VM.currentVersionShow = true;
			    	$scope.VM.isList = false;
			    	//隐藏学科学段
			    	$scope.VM.currentHeader = true;
			    	$scope.VM.currentVersionTmpShow = false;
			    }
			    
			    // 教材
			    $scope.VM.selectMaterial = function(index){
			    	$scope.VM.currentMaterial = $scope.VM.material[index];
			    	$scope.VM.currentMaterialShow = true;
			    	$scope.VM.isList = false;
			    }	
			}
		])
}());