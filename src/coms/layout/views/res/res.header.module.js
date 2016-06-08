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
				return $resource(window.TomcatUrl + "/resRestAPI/v1.0/users/:userid", {
					userid: '@_id'
				}, {
					// 查询学段
					getTerms: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/terms/"
					},
					// 查询学科
					getSubjects: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/subjects/"
					},
					// 查询教材版本
					getEditions: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/editions/"
					},
					// 查询教材
					getBooks: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/books/"
					},
					// 资源上传 删除 
					resCtrl: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/asset/"
					},
					// 获取资源 
					getUploadRes: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/asset/"
					},
					//删除资源
					deleteUploadRes: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/asset/"
					},
					editUploadRes: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/asset/:id",
						params: {
							id: '@id'
						}
					},
					// 上传资源 服务 url
					getUploadUrl: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/upload"
					},
					// 我的备课资源
					getPrepareResource: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/prepareResource"
					},
					// 我的下载
					getMyDownload: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/myDownload"
					},
					// 查询下载状态
					getMyDownloadStatus: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareZip_staus"
					},
					// 我的评论
					getMyComment : {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/userReviewComment"
					},
					// 我的浏览
					getMyRecent: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/userReview"
					},
					// 获取统一资源类型
					unifyType: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/unifyType"
					},
					//获取资源类型(根据文件的后缀)
					unifyType4ext: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/unifyType4ext"
					},
					// 查询资源库
					pools: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/pools"
					},
					// 点击下载
					resDownload: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/res_down"
					},
					//打包下载
					resZIpDownload: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/prepareZip"
					},
					//获取单个资源信息(准备编辑)
					getResDetails: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/resource/asset/:id", 
					    params:{ 
					        id:'@id'
					    }
					},
					//查询用户历史选择
					getHistory: {
						method: "GET",
						url: TomcatUrl + "/resRestAPI/v1.0/history"
					},
					// 修改 用户历史选择
					postHistory: {
						method: "POST",
						url: TomcatUrl + "/resRestAPI/v1.0/history"
					},
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
				// 如果是备课夹页面 隐藏搜索
				if( $state.current.name == "prepare") $scope.isShowSearch = true;
				
				// 筛选选择控制
				$scope.VM.currentGradeSeclet = [];
				$scope.VM.currentSubjectSeclet = [];
				$scope.VM.currentVersionSeclet = [];
				$scope.VM.currentMaterialSeclet = [];
				
				// 第一次登录全显示
				$scope.VM.isFirstLogin = $localStorage.isFirstLogin?false:true;
				$localStorage.isFirstLogin = 1;
				
				// 是否有数据 控制
				$scope.VM.noTreeData = false;
				//链式调用 
				
				// 查询历史记录
				// 有本地缓存时 读取本地缓存，无本地缓存时读取历史记录，无历史记录时读取用户设置
				var history = {};
				Res.getHistory({}, function(data){
					history = data.data;
				}).$promise.then(function(data) {
					//读取 学段 学科 版本 和教材
					return Res.getTerms({}, function(data) {
						if (data.code == "OK") {
	//						console.log("学段：", data)
							$scope.VM.grade = data.data;
							// 根据用户当前选择>当前信息选择
							if($localStorage.currentGrade) {
								$scope.VM.currentGrade = $localStorage.currentGrade.name;
								$scope.VM.currentGradeId = $localStorage.currentGrade.id;
							}else if(!!history){
								// 查询 name
								_.each(data.data, function(v,i) {
									if(v.id ==  history.termId) {
										$scope.VM.currentGrade = v.name;
									}
								})
								$scope.VM.currentGradeId = history.termId;
							}else {
								$scope.VM.currentGrade = $scope.user.termName;
								$scope.VM.currentGradeId = _.indexOf(['小学', '初中', '高中'], $scope.user.termName) + 1;
							}
							//缓存用户当前 学段
							$localStorage.currentGrade = {
								name: $scope.VM.currentGrade,
								id: $scope.VM.currentGradeId
							}
							// 选中当前
							$scope.VM.currentGradeSeclet[_.indexOf(['小学', '初中', '高中'], $localStorage.currentGrade.name)] = true;
						}
					}).$promise;
				}).then(function(data) {
					return Res.getSubjects({
						termId: $localStorage.currentGrade.id
					}, function(data) {
						$scope.VM.subject = data.data;
						// 当前用户学科： 当前选择>用户选择
						var currentSubjectName = '';
						if($localStorage.currentSubject) {
							$scope.VM.currentSubject = $localStorage.currentSubject;
							$scope.VM.currentSubjectId = $localStorage.currentSubject.id;
							currentSubjectName = $localStorage.currentSubject.name;
						}else if(!!history){
								// 查询 name
								_.each(data.data, function(v,i) {
									if(v.id ==  history.subjectId) {
										currentSubjectName = v.name;
									}
								})
								$scope.VM.currentSubjectId = history.subjectId;
						}else {
							currentSubjectName = $scope.user.subjectNames.split(',')[0];
							
							$scope.VM.currentSubjectId = $scope.user.subjectIds.split(',')[0];
						}
						//缓存用户当前 学科
						$localStorage.currentSubject = {
							name: currentSubjectName,
							id: $scope.VM.currentSubjectId
						}
						$scope.VM.currentSubject = $localStorage.currentSubject;
						// 选中当前
						_.each($scope.VM.subject, function(v, i) {
							if( v.id == $localStorage.currentSubject.id)
								$scope.VM.currentSubjectSeclet[i] = true;
						})	
//						console.log("学科：", data.data)
					}).$promise;
				}).then(function(data) {
					return Res.getEditions({
						termId: $localStorage.currentGrade.id,
						subjectId: $localStorage.currentSubject.id
					}, function(data) {
						// console.log("版本：", data.data)
						if(data.data.length > 0){
							$scope.VM.version = data.data;
							// 当前用户版本： 当前选择>用户选择		
							if($localStorage.currentVersion) {
								$scope.VM.currentVersion = $localStorage.currentVersion;
							}else if(!!history){
								// 查询 name
								var eidtionName = '';
								_.each(data.data, function(v,i) {
									if(v.id ==  history.editionId) {
										eidtionName = v.name;
									}
								})
								$scope.VM.currentVersion = {
									name: eidtionName,
									id: history.editionId
								}
							}else {
								$scope.VM.currentVersion = $scope.VM.version[0];	
								
							}
							//缓存用户当前 版本
							$localStorage.currentVersion =  $scope.VM.currentVersion;
							// 选中当前
							_.each($scope.VM.version, function(v, i) {
								if( v.id == $localStorage.currentVersion.id)
									$scope.VM.currentVersionSeclet[i] = true;
							})
						} else{
							// 是否有数据 控制
							$scope.VM.noTreeData = true;
							$scope.VM.currentVersion = '';
							$scope.$emit("noTreeData", true)
							return false;
						}
						
					}).$promise;
				}).then(function(data) {
					return Res.getBooks({
						pnodeId: $scope.VM.currentVersion?$scope.VM.currentVersion.id:''
					}, function(data) {
						// console.log("books：", data.data);
						if(data.data.length > 0){
							$scope.VM.material = data.data;
							if($localStorage.currentMaterial) {
								$scope.VM.currentMaterial = $localStorage.currentMaterial;
							}else if(!!history){
								// 查询 name
								var bookName = '';
								_.each(data.data, function(v,i) {
									if(v.id ==  history.bookId) {
										bookName = v.name;
									}
								})
								$scope.VM.currentMaterial = {
									name: bookName,
									id: history.bookId
								}
							}else {
								$scope.VM.currentMaterial = $scope.VM.material[0];	
							}
							//缓存用户当前 教材
							$localStorage.currentMaterial =  $scope.VM.currentMaterial;
							// 选中当前
							_.each($scope.VM.material, function(v, i) {
								if( v.id == $localStorage.currentMaterial.id)
									$scope.VM.currentMaterialSeclet[i] = true;
							})
							// 触发 目录树更新
							$scope.$emit("currentTreeId", $localStorage.currentMaterial.id);
							// 更改历史选择
						}
						
					}).$promise;
				})

				// 学段导航筛选
				$scope.VM.selectGrade = function(i) {
					// 是否有数据 控制
					$scope.VM.noTreeData = false;
					$scope.VM.currentGrade = $scope.VM.grade[i].name;
					$scope.VM.currentGradeId = $scope.VM.grade[i].id;
					//缓存用户当前 学段
					$localStorage.currentGrade = {
						name: $scope.VM.currentGrade,
						id: $scope.VM.currentGradeId
					}
					// 目录树改变
					$localStorage.selectChange = false;
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
					
					$scope.VM.currentVersionSeclet[0] = true;
					
					$scope.VM.currentMaterialSeclet[0] = true;
					
					
					
					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					
					Res.getSubjects({
						termId: $scope.VM.grade[i].id
					}, function(data) {
						$scope.VM.subject = data.data;
						//缓存用户当前 学科
						$localStorage.currentSubject = $scope.VM.subject[0];
						//回归第一个
						_.each($scope.VM.subject, function(v, i) {
							$scope.VM.currentSubjectSeclet[i] = false;
						})
						$scope.VM.currentSubject = $scope.VM.subject[0];
						$scope.VM.currentSubjectSeclet[0] = true;

					}).$promise.then(function(data) {
						return Res.getEditions({
							termId: $scope.VM.grade[i].id,
							subjectId: $scope.VM.subject[0].id
						}, function(data) {
							$scope.VM.version = data.data;
							//缓存用户当前 版本
							$localStorage.currentVersion = $scope.VM.version[0];
							
							//回归第一个
							_.each($scope.VM.version, function(v, i) {
								$scope.VM.currentVersionSeclet[i] = false;
							})
							$scope.VM.currentVersion = $scope.VM.version[0];
							$scope.VM.currentVersionSeclet[0] = true;
						}).$promise;
					}).then(function(data) {
						return Res.getBooks({
							pnodeId: $scope.VM.version[0].id
						}, function(data) {
//							console.log("books：", data.data);
							$scope.VM.material = data.data;
							//缓存用户当前 教材
							$localStorage.currentMaterial =  $scope.VM.material[0];
							//回归第一个
							_.each($scope.VM.material, function(v, i) {
								$scope.VM.currentMaterialSeclet[i] = false;
							})
							$scope.VM.currentMaterial = $scope.VM.material[0];
							$scope.VM.currentMaterialSeclet[0] = true;
							$scope.$emit("currentTreeId", $scope.VM.material[0].id);
						}).$promise;
					})
				}

				//学科控制
				$scope.VM.selectSubject = function(index) {
					// 是否有数据 控制
					$scope.VM.noTreeData = false;
					$scope.VM.currentSubject = $scope.VM.subject[index];
					//缓存用户当前 学科
					$localStorage.currentSubject = $scope.VM.subject[index];
					// 目录树改变
					$localStorage.selectChange = false;
					//选中
					_.each($scope.VM.subject, function(v, i) {
						$scope.VM.currentSubjectSeclet[i] = false;
					})
					$scope.VM.currentSubjectSeclet[index] = true;


					//备课夹 视图切换 
					$scope.VM.isList = false;
					$localStorage.isPrepareList = $scope.VM.isList;

					$scope.VM.currentVersionShow = false;
					$scope.VM.currentMaterialShow = false;
					
					Res.getEditions({
						termId: $scope.VM.currentGradeId,
						subjectId: $scope.VM.subject[index].id
					}, function(data) {
						if(data.data.length > 0){
//							console.log("版本1：", data.data);
							$scope.VM.version = data.data;
							//缓存用户当前 版本
							$localStorage.currentVersion = $scope.VM.version[0];
							//回归第一个
							_.each($scope.VM.version, function(v, i) {
								$scope.VM.currentVersionSeclet[i] = false;
							})
							$scope.VM.currentVersion = $scope.VM.version[0];
							$scope.VM.currentVersionSeclet[0] = true;
						} else{
							// 是否有数据 控制
							$scope.VM.version = '';
							$scope.VM.currentVersion = '';
							$scope.VM.currentMaterial = '';
							$scope.VM.noTreeData = true;
							$scope.$emit("noTreeData", true)
							return false;
						}
					}).$promise.then(function(data) {
						return Res.getBooks({
							pnodeId: !!$scope.VM.version ? $scope.VM.version[0].id:''
						}, function(data) {
//							console.log("books：", data.data);
							if(!!data.data){
								$scope.VM.material = data.data;
								//缓存用户当前 教材
								$localStorage.currentMaterial =  $scope.VM.material[0];
								//回归第一个
								_.each($scope.VM.material, function(v, i) {
									$scope.VM.currentMaterialSeclet[i] = false;
								})
								$scope.VM.currentMaterial = $scope.VM.material[0];
								$scope.VM.currentMaterialSeclet[0] = true;
								// 当没有教材时，取版本id
								$scope.$emit("currentTreeId", $scope.VM.material[0] ? $scope.VM.material[0].id : $scope.VM.version[0].id)
							}else{
								return;
							}
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
					// 目录树改变
					$localStorage.selectChange = false;
					//选中
					_.each($scope.VM.version, function(v, i) {
						$scope.VM.currentVersionSeclet[i] = false;
					})
					$scope.VM.currentVersionSeclet[index] = true;
					//备课夹 视图切换 
					$scope.VM.isList = false;
					$localStorage.isPrepareList = $scope.VM.isList;
					
					Res.getBooks({
						pnodeId: $scope.VM.version[index].id
					}, function(data) {
//						console.log("books：", data.data);
						$scope.VM.material = data.data;
						if($scope.VM.material && $scope.VM.material.length > 0)
							//缓存用户当前 教材
							$localStorage.currentMaterial =  $scope.VM.material[0];
							$scope.$emit("currentTreeId", $scope.VM.material[0].id);
							//回归第一个
							_.each($scope.VM.material, function(v, i) {
								$scope.VM.currentMaterialSeclet[i] = false;
							})
							$scope.VM.currentMaterial = $scope.VM.material[0];
							$scope.VM.currentMaterialSeclet[0] = true;
					})
				}

				// 教材
				$scope.VM.currentMaterialTmpShow = true;
				$scope.VM.selectMaterial = function(index) {
					$scope.VM.currentMaterial = $scope.VM.material[index];
					$scope.VM.currentMaterialShow = true;
					$scope.VM.currentMaterialTmpShow = false;
					// 目录树改变
					$localStorage.selectChange = false;
					//缓存用户当前 教材
					$localStorage.currentMaterial =  $scope.VM.currentMaterial;
					//选中
					_.each($scope.VM.material, function(v, i) {
						$scope.VM.currentMaterialSeclet[i] = false;
					})
					$scope.VM.currentMaterialSeclet[index] = true;
					$scope.$emit("currentTreeId", $scope.VM.currentMaterial.id);
				}
				
				// 搜索
				$scope.search = function(){
					$localStorage.searchKeyWord = $scope.searchKeywords;
					$state.go("search");
				}
				
			}
		])
}());