/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("uploadResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage', '$uibModal', 'ModalMsg', 'Res', 'Upload', '$timeout', '$uibModalInstance',
			function($scope, $stateParams, $state, $location, $localStorage, $uibModal, ModalMsg, Res, Upload, $timeout, $uibModalInstance) {
				// 用户信息
				$scope.user = $localStorage.authUser;

				Res.getUploadUrl({}, function(data) {

					$scope.uploadData = data.data
					console.log("uploadData:", $scope.uploadData)
						//					
				})

				// 编辑完资源信息上传
				$scope.VM = {
					resName: '未命名',
					resSize: 0
				}

				// 第一屏显示
				$scope.firstUpload = true;

				// 显示本地资源
				$scope.isLocal = true;

				// 上传返回的文件名
				$scope.uploadFiles = function(files, errFiles) {
					$scope.firstUpload = false;
					$scope.files = files;
					//			        console.log(files)
					//			        $scope.errFiles = errFiles;
					angular.forEach($scope.files, function(file) {
						console.log(file)
						file.upload = Upload.upload({
							url: $scope.uploadData.uploadUrl,
							data: {
								file: file
							}
						});

						file.upload.then(function(response) {
							$timeout(function() {
								file.result = response.data;
								$scope.files.responseName = response.data;
								console.log(response.data)
							});
						}, function(response) {
							console.log(response.data)
							if (response.status > 0)
								$scope.errorMsg = response.status + ': ' + response.data;
						}, function(evt) {
							file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
							$scope.progress = file.progress;
						});
					});
				}

				$scope.uploadResInfo = function() {
					$uibModalInstance.dismiss('cancel');
					
					$localStorage.uploadData = $scope.uploadData;
					
					// localstorage不支持file对象？ 转存一下
					var files = [];
					_.each($scope.files, function(v,i){
						console.log(v)
						var tmp = {};
						tmp.name = v.name;
						tmp.responseName = v.result;
						tmp.size = v.size;
						
						files = files.concat(tmp);
					})
					$localStorage.files = files;
//					$localStorage.files = {
//						name: $scope.files[0].name,
//						responseName:  $scope.files[0].result
//					};
					
					setTimeout(function(){
						var modalNewUpload = $uibModal.open({
							templateUrl: "eiditResModal.html",
							windowClass: "upload-modal",
							controller: 'editResController',
	//						scope: $scope //Refer to parent scope here
						})
					}, 300) 
				}
			}
		])
		// 编辑资源信息
		.controller("editResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage', '$uibModalInstance', 'ModalMsg', 'Res', 'Upload', '$timeout',
			function($scope, $stateParams, $state, $location, $localStorage, $uibModalInstance, ModalMsg, Res, Upload, $timeout) {
				//变量共享
				$scope.VM = {};
				
				$scope.uploadData = $localStorage.uploadData;
				$scope.uploadFilesData = $localStorage.files;
				
				
				
				console.log($scope.uploadData, $scope.uploadFilesData)
				// 获取资源类型
				Res.unifyType({}, function(data) {
					$scope.unifyType = data.data;
				})
				
				$scope.res = {};
				// resTitle
				$scope.res.resTitle = $scope.uploadFilesData[0].name.split('.')[0];
				$scope.res.keywords = '';
				$scope.res.description = '';
				$scope.uploadEditResInfo = function() {
					console.log("ooooo")
//					$scope.VM.name = $scope.files.name;
					Res.resCtrl({
						names:$scope.res.resTitle,
						unifTypeIds: $scope.unifyType[$scope.currentTypeIndexSeclet].id,
						tfcodes: $scope.VM.currentMaterial.tfcode,
						scopes: $scope.currentScopeIndexSeclet,
						keywords: $scope.res.keywords,
						descs: $scope.res.description,
						paths: $scope.uploadData.uploadPath + $scope.uploadFilesData[0].responseName,
						sizes: $scope.uploadFilesData[0].size,
						iscoursewares: 0,
						islocals: 0
					}, function(data) {
						if(data.code == "OK") {
							$uibModalInstance.dismiss('cancel');
							ModalMsg.logger("上传成功啦");
							// 上传资源 列表
							setTimeout(function(){
								window.location.reload();
							}, 1000)
						}else{
							ModalMsg.logger("内容填写不正确，请修改");
						}
						
					})
				}
				
				// 取消
				$scope.moveCancel = function() {
					$uibModalInstance.dismiss('cancel');
				};

				// 筛选选择控制
				$scope.VM.currentGradeSeclet = [];
				$scope.VM.currentSubjectSeclet = [];
				$scope.VM.currentVersionSeclet = [];
				$scope.VM.currentMaterialSeclet = [];

				//学段、学科、版本和课本级联

				//读取 学段 学科 版本 和教材
				Res.getTerms({}, function(data) {
						console.log(data);
						if (data.code == "OK") {
							$scope.VM.grade = data.data;
							// 根据用户当前选择>当前信息选择
							if ($localStorage.currentGrade) {
								$scope.VM.currentGrade = $localStorage.currentGrade.name;
								$scope.VM.currentGradeId = $localStorage.currentGrade.id;
							} else {
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
					})
					.$promise.then(function(data) {
						return Res.getSubjects({
							termId: $localStorage.currentGrade.id
						}, function(data) {
							$scope.VM.subject = data.data;
							// 当前用户学科： 当前选择>用户选择		
							if ($localStorage.currentSubject) {
								$scope.VM.currentSubject = $localStorage.currentSubject;
								$scope.VM.currentSubjectId = $localStorage.currentSubject.id;
							} else {
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
								if (v.id == $localStorage.currentSubject.id)
									$scope.VM.currentSubjectSeclet[i] = true;
							})
							console.log("学科：", data.data)
						}).$promise;
					})
					.then(function(data) {
						return Res.getEditions({
							termId: $localStorage.currentGrade.id,
							subjectId: $localStorage.currentSubject.id
						}, function(data) {
							console.log("版本：", data.data);
							$scope.VM.version = data.data;
							if ($scope.VM.version.length == 0) {
								$scope.VM.currentVersion = null;
							} else {
								// 当前用户版本： 当前选择>用户选择		
								if ($localStorage.currentVersion) {
									$scope.VM.currentVersion = $localStorage.currentVersion;
								} else {
									$scope.VM.currentVersion = $scope.VM.version[0];
									//缓存用户当前 版本
									$localStorage.currentVersion = $scope.VM.version[0];
								}
								// 选中当前
								_.each($scope.VM.version, function(v, i) {
									if (v.id == $localStorage.currentVersion.id)
										$scope.VM.currentVersionSeclet[i] = true;
								})
							}

						}).$promise;
					})
					.then(function(data) {
						var id = 0;
						if ($scope.VM.currentVersion != null) {
							if ($localStorage.currentVersion) id = $localStorage.currentVersion.id;

							return Res.getBooks({
								pnodeId: id
							}, function(data) {
								console.log("books：", data.data);
								$scope.VM.material = data.data;
								if ($localStorage.currentMaterial) {
									$scope.VM.currentMaterial = $localStorage.currentMaterial;
								} else {
									$scope.VM.currentMaterial = $scope.VM.material[0];
									//缓存用户当前 教材
									$localStorage.currentMaterial = $scope.VM.material[0];
								}
								// 选中当前
								_.each($scope.VM.material, function(v, i) {
									if (v.id == $localStorage.currentMaterial.id)
										$scope.VM.currentMaterialSeclet[i] = true;
								})
								// 触发 目录树更新
//								$scope.$emit("currentTreeId", $localStorage.currentMaterial.id)

							}).$promise;
						}

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
							console.log("books：", data.data);
							$scope.VM.material = data.data;
							//缓存用户当前 教材
							$localStorage.currentMaterial = $scope.VM.material[0];
							//回归第一个
							_.each($scope.VM.material, function(v, i) {
								$scope.VM.currentMaterialSeclet[i] = false;
							})
							$scope.VM.currentMaterial = $scope.VM.material[0];
							$scope.VM.currentMaterialSeclet[0] = true;
//							$scope.$emit("currentTreeId", $scope.VM.material[0].id)
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
						//缓存用户当前 版本
						$localStorage.currentVersion = $scope.VM.version[0];
						//回归第一个
						_.each($scope.VM.version, function(v, i) {
							$scope.VM.currentVersionSeclet[i] = false;
						})
						$scope.VM.currentVersion = $scope.VM.version[0];
						$scope.VM.currentVersionSeclet[0] = true;
						console.log("版本：", data.data);
					}).$promise.then(function(data) {
						return Res.getBooks({
							pnodeId: $scope.VM.version[0] ? $scope.VM.version[0].id : ''
						}, function(data) {
							console.log("books：", data.data);
							$scope.VM.material = data.data;
							//缓存用户当前 教材
							$localStorage.currentMaterial = $scope.VM.material[0];
							//回归第一个
							_.each($scope.VM.material, function(v, i) {
								$scope.VM.currentMaterialSeclet[i] = false;
							})
							$scope.VM.currentMaterial = $scope.VM.material[0];
							$scope.VM.currentMaterialSeclet[0] = true;
							// 当没有教材时，取版本id
//							$scope.$emit("currentTreeId", $scope.VM.material[0] ? $scope.VM.material[0].id : $scope.VM.version[0].id)
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
						if ($scope.VM.material && $scope.VM.material.length > 0)
						//缓存用户当前 教材
							$localStorage.currentMaterial = $scope.VM.material[0];
//						$scope.$emit("currentTreeId", $scope.VM.material[0].id);
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
					//缓存用户当前 教材
					$localStorage.currentMaterial = $scope.VM.currentMaterial;
					//选中
					_.each($scope.VM.material, function(v, i) {
						$scope.VM.currentMaterialSeclet[i] = false;
					})
					$scope.VM.currentMaterialSeclet[index] = true;
//					$scope.$emit("currentTreeId", $scope.VM.currentMaterial.id);
					

				}
				
				// 资源类型选择
				$scope.currentTypeSeclet = [];
				$scope.currentTypeSeclet[0] = true;
				$scope.currentTypeIndexSeclet = 4;
				$scope.selectType = function(index) {
					//选中
					_.each($scope.unifyType, function(v, i) {
						$scope.currentTypeSeclet[i] = false;
					})
					$scope.currentTypeSeclet[index] = true;
					$scope.currentTypeIndexSeclet = index;
				}
				
				// 共享范围
				$scope.currentScopeSeclet = [];
				$scope.currentScopeSeclet[0] = true;
				$scope.currentScopeIndexSeclet = 0;
				$scope.selectScope = function(index) {
					//选中
					_.each([0,1,2], function(v, i) {
						$scope.currentScopeSeclet[i] = false;
					})
					$scope.currentScopeSeclet[index] = true;
					$scope.currentScopeIndexSeclet = index;
				}
				
				

			}
		])
}());