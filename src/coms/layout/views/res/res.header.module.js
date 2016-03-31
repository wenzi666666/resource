/**
 * 系统资源 header controller
 */
(function() {
	'use strict';
	//资源筛选头
	ApplicationConfiguration.registerModule('webApp.coms.ResHeader');
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
				//读取 学段 学科 版本 和教材
				Res.getTerms({}, function(data) {
					if (data.code == "OK") {
						console.log("学段：", data)
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
						$scope.VM.currentSubject = $scope.VM.subject[0];
						console.log("学科：", data.data)
					}).$promise;
				}).then(function(data) {
					return Res.getEditions({
						termId: $scope.VM.grade[0].id,
						subjectId: $scope.VM.subject[0].id
					}, function(data) {
						console.log("版本：", data.data);
						$scope.VM.version = data.data;
						$scope.VM.currentVersion = $scope.VM.version[0];
					}).$promise;
				}).then(function(data) {
					return Res.getBooks({
						pnodeId: $scope.VM.version[0].id
					}, function(data) {
						console.log("books：", data.data);
						$scope.VM.material = data.data;
					}).$promise;
				})

				// 学段导航筛选
				$scope.VM.currentGradeSeclet = [];
				$scope.VM.currentGradeSeclet[0] = true;
				$scope.VM.selectGrade = function(i) {
					$scope.VM.currentGrade = $scope.VM.grade[i].name;
					$scope.VM.currentGradeId = $scope.VM.grade[i].id;
					
					//选中
					_.each($scope.VM.grade, function(v, i) {
						$scope.VM.currentGradeSeclet[i] = false;
					})
					$scope.VM.currentGradeSeclet[i] = true;
					
					//回归第一个
					_.each($scope.VM.subject, function(v, i) {
						$scope.VM.currentSubjectSeclet[i] = false;
					})
					$scope.VM.currentSubject = $scope.VM.subject[0];
					$scope.VM.currentSubjectSeclet[0] = true;
					
					$scope.VM.currentSubjectSeclet[0] = true;
					$scope.VM.currentVersionSeclet[0] = true;
					$scope.VM.currentMaterialSeclet[0] = true;
					
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					
					Res.getSubjects({
						termId: $scope.VM.grade[i].id
					}, function(data) {
						$scope.VM.subject = data.data;

					}).$promise.then(function(data) {
						return Res.getEditions({
							termId: $scope.VM.grade[i].id,
							subjectId: $scope.VM.subject[0].id
						}, function(data) {
							$scope.VM.version = data.data;
						}).$promise;
					}).then(function(data) {
						return Res.getBooks({
							pnodeId: $scope.VM.version[0].id
						}, function(data) {
							console.log("books：", data.data);
							$scope.VM.material = data.data;
						}).$promise;
					})
				}



				//学科控制
				$scope.VM.currentSubjectSeclet = [];
				$scope.VM.currentSubjectSeclet[0] = true;
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
					
					Res.getEditions({
						termId: $scope.VM.currentGradeId,
						subjectId: $scope.VM.subject[index].id
					}, function(data) {
						$scope.VM.version = data.data;
						console.log("版本：", data.data);
					}).$promise.then(function(data) {
						return Res.getBooks({
							pnodeId: $scope.VM.version[0]?$scope.VM.version[0].id:''
						}, function(data) {
							console.log("books：", data.data);
							$scope.VM.material = data.data;
						}).$promise;
					})
				}

				// 版本
				setTimeout(function() {
					$('.res-material-content').eq(0).addClass('selected')
				}, 100)
				$scope.VM.currentVersionTmpShow = true;
				$scope.VM.currentVersionSeclet = [];
				$scope.VM.currentVersionSeclet[0] = true;
				$scope.VM.selectVersion = function(index) {
					$scope.VM.currentVersion = $scope.VM.version[index];
					$scope.VM.currentVersionShow = true;

					//隐藏学科学段
					$scope.VM.currentHeader = true;
					$scope.VM.currentVersionTmpShow = false;

					//备课夹 视图切换 临时
					$scope.VM.isList = false;
					
					Res.getBooks({
						pnodeId: $scope.VM.version[index].id
					}, function(data) {
						console.log("books：", data.data);
						$scope.VM.material = data.data;
					})
				}

				// 教材
				$scope.VM.currentMaterialSeclet = [];
				$scope.VM.currentMaterialSeclet[0] = true
				$scope.VM.selectMaterial = function(index) {
					$scope.VM.currentMaterial = $scope.VM.material[index];
					$scope.VM.currentMaterialShow = true;

					//选中
					_.each($scope.VM.material, function(v, i) {
						$scope.VM.currentMaterialSeclet[i] = false;
					})
					$scope.VM.currentMaterialSeclet[index] = true;
				}
			}
		])
}());