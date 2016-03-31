/**
 * 系统资源 header controller
 */
(function() {
	'use strict';

	angular.module('webApp.coms.ResHeader')
		.factory('Res', ['$resource',
			function($resource) {
				return $resource(window.BackendUrl + "/resRestAPI/v1.0/users/:userid", {
					userid: '@_id'
				}, {
					// 查询学段
					getTerms: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/terms/"
					},
					// 查询学科
					getSubjects: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/subjects/"
					},
					// 查询教材版本
					getEditions: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/editions/"
					},
					// 查询教材
					getBooks: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/books/"
					}
				})
			}
		])
		.controller("ResHeaderController", ['$scope', '$stateParams', '$state', '$location', 'Res', '$q', '$timeout',
			function($scope, $stateParams, $state, $location, Res, $q, $timeout) {
				// 初始化data
				$scope.initData = function() {

				}
				
				//第一次进入 链式调用
				Res.getTerms({}, function(data) {
					if(data.code=="OK"){
						console.log("学段：",data)
						$scope.VM.grade = data.data;
						$scope.VM.currentGrade = $scope.VM.grade[0].name;
						$scope.VM.currentGradeId = $scope.VM.grade[0].id;
					} else {
						alert("token失效啦，请重新登录");
						window.location.href = "login.html";
					}
				}).$promise.then(function(data) {
					return Res.getSubjects({
						termId: $scope.VM.grade[0].id
					}, function(data) {
						$scope.VM.subject = data.data;
						console.log("学科：",data.data)
					}).$promise;
				}).then(function(data) {
					return Res.getEditions({
						termId: $scope.VM.grade[0].id,
						subjectId: $scope.VM.subject[0].id
					}, function(data) {
						console.log("版本：",data.data);
						$scope.VM.version = data.data;
					}).$promise;
				}).then(function(data) {
					return Res.getBooks({
						pnodeId : $scope.VM.version[0].id
					}, function(data) {
						console.log("books：",data.data);
						$scope.VM.version = data.data;
					}).$promise;
				})
					//
					//				Res.getSubjects({
					//					termId: 1
					//				}, function(data) {
					//					if (data.code == "OK") {
					//						//						$scope.VM.grade = data.data;
					//						//						$scope.VM.currentGrade = $scope.VM.grade[1].name;
					//						console.log(data.data)
					//					}
					//				})
					//
					//				Res.getEditions({
					//					termId: 1,
					//					subjectId: 1
					//				}, function(data) {
					//					if (data.code == "OK") {
					//						//						$scope.VM.grade = data.data;
					//						//						$scope.VM.currentGrade = $scope.VM.grade[1].name;
					//						console.log(data.data)
					//					}
					//				})

				// 学段导航筛选
//				$scope.VM.selectGrade = function($index) {
//					Res.getSubjects({
//							termId:
//						}, function(data) {
//							console.log(data)
//						})
//						.$promise.then(function(data) {
//							return Res.getEditions({
//								termId: 1
//							}, function(data) {
//								console.log(data)
//							}).$promise;
//						})
//				}

				$scope.test = Res.getTerms({});
				$q.all([
						$scope.test.$promise
					])
					.then(function(result) {
						console.log(result);
					})

				var promises = [];
				var defferGrade = $q.defer();
				var defferSubject = $q.defer();

				$timeout(function() {
					defferGrade.resolve("hahaha");
				}, 2000);
				$timeout(function() {
					defferSubject.resolve("oooo");
				}, 2000);
				promises.push(defferGrade.promise);
				promises.push(defferSubject.promise);
				$q.all(promises).then(function(data) {
					console.log(data);
				});

				// 变量
				//				$scope.VM.grade = ["小学","初中","高中"];
				$scope.VM.subject = ["语文", "数学", "英语", "物理", "化学", "生物", "地理", "政治", "信息技术"];
				$scope.VM.version = ["课标版", "北师大版本", "人教版", "鲁教版", "苏科版", "粤教版", "华东师大版本"];
				$scope.VM.material = ["必修1", "必修2", "必修3", "必修4", "必修5", "必修6"];

				//学段控制

				$scope.VM.currentGradeSeclet = [];
				$scope.VM.currentGradeSeclet[1] = true;
				//			    $scope.VM.selectGrade = function(index){
				//			    	$scope.VM.currentGrade = $scope.VM.grade[index].name;
				//			    	//选中
				//			    	_.each($scope.VM.grade,function(v,i){
				//			    		$scope.VM.currentGradeSeclet[i] = false;
				//			    	})
				//			    	$scope.VM.currentGradeSeclet[index] = true;
				//			    	
				//			    	$scope.VM.currentVersionShow = false;
				//					$scope.VM.currentMaterialShow = false;
				//					
				//			    }

				//学科控制
				$scope.VM.currentSubject = $scope.VM.subject[0];
				$scope.VM.currentSubjectSeclet = [];
				$scope.VM.currentSubjectSeclet[0] = true
				$scope.VM.selectSubject = function(index) {
					$scope.VM.currentSubject = $scope.VM.subject[index];
					//选中
					_.each($scope.VM.subject, function(v, i) {
						$scope.VM.currentSubjectSeclet[i] = false;
					})
					$scope.VM.currentSubjectSeclet[index] = true;

					//备课夹 视图切换 临时
					$scope.VM.isList = false;

					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
				}

				// 版本
				setTimeout(function() {
					$('.res-material-content').eq(0).addClass('selected')
				}, 100)
				$scope.VM.currentVersion = $scope.VM.version[0];
				$scope.VM.currentVersionTmpShow = true;
				$scope.VM.selectVersion = function(index) {
					$scope.VM.currentVersion = $scope.VM.version[index];
					$scope.VM.currentVersionShow = true;

					//隐藏学科学段
					$scope.VM.currentHeader = true;
					$scope.VM.currentVersionTmpShow = false;

					//备课夹 视图切换 临时
					$scope.VM.isList = false;
				}

				// 教材
				$scope.VM.selectMaterial = function(index) {
					$scope.VM.currentMaterial = $scope.VM.material[index];
					$scope.VM.currentMaterialShow = true;
				}
			}
		])
}());