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
		.controller("ResHeaderController", ['$scope', '$stateParams', '$state', '$location', 'Res', '$q', '$timeout','$localStorage','ModalMsg',
			function($scope, $stateParams, $state, $location, Res, $q, $timeout, $localStorage,ModalMsg) {
				// 初始化data
				$scope.initData = function() {
					// 用户信息
					$scope.user = $localStorage.authUser;
				}
				
				// 筛选选择控制
				$scope.VM.currentGradeSeclet = [];
				$scope.VM.currentSubjectSeclet = [];
				$scope.VM.currentVersionSeclet = [];
				$scope.VM.currentMaterialSeclet = [];

				//第一次进入 链式调用 
				//读取 学段 学科 版本 和教材
				Res.getTerms({}, function(data) {
					if (data.code == "OK") {
						console.log("学段：", data)
						$scope.VM.grade = data.data;
						// 根据用户当前选择>当前信息选择
						if($localStorage.currentGrade) {
							$scope.VM.currentGrade = $localStorage.currentGrade.name;
							$scope.VM.currentGradeId = $localStorage.currentGrade.id;
							
						}else {
							$scope.VM.currentGrade = $scope.user.termName;
							$scope.VM.currentGradeId = _.indexOf(['小学', '初中', '高中'], $scope.user.termName) + 1;
							//缓存用户当前 学段
							$localStorage.currentGrade = {
								name: $scope.user.termName,
								id: $scope.VM.currentGradeId
							}
						}
						// 选中当前
						$scope.VM.currentGradeSeclet[_.indexOf(['小学', '初中', '高中'], $localStorage.currentGrade.name)] = true;
					} else {
						ModalMsg.logger("token失效啦，请重新登录");
						window.location.href = "login.html";
					}
				}).$promise.then(function(data) {
					return Res.getSubjects({
						termId: $localStorage.currentGrade.id
					}, function(data) {
						$scope.VM.subject = data.data;
						// 当前用户学科： 当前选择>用户选择		
						if($localStorage.currentSubject) {
							$scope.VM.currentSubject = $localStorage.currentSubject;
							$scope.VM.currentSubjectId = $localStorage.currentSubject.id;
						}else {
							$scope.VM.currentSubject = $scope.user.subjectNames.split(',')[0];
							var currentSubjectId = $scope.user.subjectIds.split(',')[0];			
							//缓存用户当前 学科
							$localStorage.currentSubject = {
								name: $scope.VM.currentSubject,
								id: currentSubjectId
							}
						}
						// 选中当前
						_.each($scope.VM.subject, function(v, i) {
							if( v.name == $localStorage.currentSubject.name)
								$scope.VM.currentSubjectSeclet[i] = true;
						})	
						console.log("学科：", data.data)
					}).$promise;
				}).then(function(data) {
					return Res.getEditions({
						termId: $localStorage.currentGrade.id,
						subjectId: $localStorage.currentSubject.id
					}, function(data) {
						console.log("版本：", data.data);
						$scope.VM.version = data.data;
						// 当前用户版本： 当前选择>用户选择		
						if($localStorage.currentVersion) {
							$scope.VM.currentVersion = $localStorage.currentVersion;
						}else {
							$scope.VM.currentVersion = $scope.VM.version[0];	
							//缓存用户当前 版本
							$localStorage.currentVersion =  $scope.VM.version[0];
						}
						// 选中当前
						_.each($scope.VM.version, function(v, i) {
							if( v.name == $localStorage.currentVersion.name)
								$scope.VM.currentVersionSeclet[i] = true;
						})
					}).$promise;
				}).then(function(data) {
					return Res.getBooks({
						pnodeId: $localStorage.currentVersion.id
					}, function(data) {
						console.log("books：", data.data);
						$scope.VM.material = data.data;
						if($localStorage.currentMaterial) {
							$scope.VM.currentMaterial = $localStorage.currentMaterial;
						}else {
							$scope.VM.currentMaterial = $scope.VM.material[0];	
							//缓存用户当前 教材
							$localStorage.currentMaterial =  $scope.VM.material[0];
						}
						// 选中当前
						_.each($scope.VM.material, function(v, i) {
							if( v.name == $localStorage.currentMaterial.name)
								$scope.VM.currentMaterialSeclet[i] = true;
						})
						// 触发 目录树更新
						$scope.$emit("currentTreeId", $localStorage.currentMaterial.id)
						
					}).$promise;
				})

				// 学段导航筛选
				$scope.VM.selectGrade = function(i) {
					$scope.VM.currentGrade = $scope.VM.grade[i].name;
					$scope.VM.currentGradeId = $scope.VM.grade[i].id;
					//缓存用户当前 学段
					$localStorage.currentGrade = {
						name: $scope.VM.currentGrade,
						id: $scope.VM.currentGradeId
					}
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
							$scope.$emit("currentTreeId", $scope.VM.material[0].id)
						}).$promise;
					})
				}

				//学科控制
				$scope.VM.selectSubject = function(index) {
					$scope.VM.currentSubject = $scope.VM.subject[index];
					//缓存用户当前 学科
					$localStorage.currentSubject = $scope.VM.subject[index];
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
							pnodeId: $scope.VM.version[0] ? $scope.VM.version[0].id:''
						}, function(data) {
							console.log("books：", data.data);
							$scope.VM.material = data.data;
							// 当没有教材时，取版本id
							$scope.$emit("currentTreeId", $scope.VM.material[0] ? $scope.VM.material[0].id : $scope.VM.version[0].id)
						}).$promise;
					})
				}

				// 版本	
				$scope.VM.currentVersionTmpShow = true;
				$scope.VM.selectVersion = function(index) {
					$scope.VM.currentVersion = $scope.VM.version[index];
					$scope.VM.currentVersionShow = true;
					//缓存用户当前 版本
					$localStorage.currentVersion = $scope.VM.currentVersion;
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
						$scope.$emit("currentTreeId", $scope.VM.material[0].id)
					})
				}

				// 教材
				$scope.VM.selectMaterial = function(index) {
					$scope.VM.currentMaterial = $scope.VM.material[index];
					$scope.VM.currentMaterialShow = true;
					//缓存用户当前 教材
					$localStorage.currentMaterial =  $scope.VM.currentMaterial;
					//选中
					_.each($scope.VM.material, function(v, i) {
						$scope.VM.currentMaterialSeclet[i] = false;
					})
					$scope.VM.currentMaterialSeclet[index] = true;
					$scope.$emit("currentTreeId", $scope.VM.material[index].id)
				}
			}
		])
}());