/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myUploadCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage', "$uibModal", 'ModalMsg','Res', 'Personal',
			function($scope, $stateParams, $state, $location, $localStorage, $uibModal, ModalMsg, Res, Personal) {
				//共享变量
				$scope.VM = {};

				// 用户信息
				$scope.user = $localStorage.authUser;
				$scope.VM.currentPage = 1;
				$scope.VM.perPage = 10;
				$scope.maxSize = 3;
				var page = 1;
				// 上传资源 列表
				

				//获取上传资源
				$scope.getResList = function() {
					Res.getUploadRes({
						unifyTypeId: '1',
						fileFormat: '全部',
						page: $scope.VM.currentPage,
						perPage: $scope.VM.perPage
					}, function(data) {
						console.log("uploadList:", data.data)
						$scope.VM.uploadFileList = data.data;
						$scope.totalItems = data.data.totalLines;
						// console.log($scope.totalItems);
					})
				}

				$scope.getResList();

				//获取资源类型
				Personal.getResType({
					tabCode: "myUpload"
				}, function(data) {
					$scope.resTypes = data.data;				
				})

				//添加批量删除资源
				$scope.resToBeDelete = [];
				$scope.addResDeleting = function(id) {
					$scope.resToBeDelete.push(id);
				}

				$scope.deleteSingleRes = function(id) {
					var deleteModal = ModalMsg.confirm("确定删除该上传资源？");
					deleteModal.result.then(function(data) {
						if(data) {
							Res.getUploadRes({
								_method: "DELETE",
								resIds: id
							}, function(data) {
								ModalMsg.logger("删除资源成功！");
							})
						}
					}) 
				}

				//批量删除资源
				$scope.deleteSomeRes = function() {
					if($scope.resToBeDelete.length == 0) {
						ModalMsg.logger("您没有选择任何资源");
					}
					else {
						var deleteModal = ModalMsg.confirm("确定批量删除这些上传资源？");
						deleteModal.result.then(function(data) {
							if(data) {
								Res.getUploadRes({
									_method: "DELETE",
									resIds: $scope.resToBeDelete.join(',')
								}, function(data) {
									ModalMsg.logger("删除资源成功！");
								})
							}
						}) 
					}
				}

				//编辑资源
				$scope.editRes = function(res) {
					console.log(res);
					var editResModal = $uibModal.open({
						templateUrl: 'edit.html', 
						controller: 'editResInstanceCtrl',
						size: 'slg',
						resolve: {
							resitem: function() {
								return res;
							}
						}
					})

					editResModal.result.then(function(data) {

					})
				}

				//分页
				$scope.pageTo = 1;
				$scope.pageChanged = function(pagenum) {
					console.log($scope.VM.currentPage);
					if(pagenum == undefined) {
						$scope.getResList();
					}
					else {
						$scope.VM.currentPage = pagenum;
						$scope.getResList();
					}
				}

				$scope.changPerPage = function() {
					$scope.VM.currentPage = 1;
					$scope.getResList();
				}
			}
		])

		.controller('editUploadResCtrl', ['$scope', function($socpe) {

		}])

		.controller('editResInstanceCtrl', ['$scope', '$uibModal', '$uibModalInstance', "$localStorage", 'Res', 'resitem', function($scope, $uibModal, $uibModalInstance, $localStorage, Res, resitem) {
			
			//变量共享
			$scope.VM = {};
			$scope.res = {};

			$scope.res.unifyType = resitem.unifyType;

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
						if($localStorage.currentGrade) {
							$scope.VM.currentGrade = $localStorage.currentGrade.name;
							$scope.VM.currentGradeId = $localStorage.currentGrade.id;
						}
						else {
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
							if( v.id == $localStorage.currentSubject.id)
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
						if($scope.VM.version.length == 0) {
							$scope.VM.currentVersion = null;
						}
						else {
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
								if( v.id == $localStorage.currentVersion.id)
									$scope.VM.currentVersionSeclet[i] = true;
							})
						}
						
					}).$promise;
				})
				.then(function(data) {
					var id = 0;
					if($scope.VM.currentVersion != null) {
						if($localStorage.currentVersion) id = $localStorage.currentVersion.id;

						return Res.getBooks({
							pnodeId: id
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
								if( v.id == $localStorage.currentMaterial.id)
									$scope.VM.currentMaterialSeclet[i] = true;
							})
							// 触发 目录树更新
							$scope.$emit("currentTreeId", $localStorage.currentMaterial.id)
							
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
							$localStorage.currentMaterial =  $scope.VM.material[0];
							//回归第一个
							_.each($scope.VM.material, function(v, i) {
								$scope.VM.currentMaterialSeclet[i] = false;
							})
							$scope.VM.currentMaterial = $scope.VM.material[0];
							$scope.VM.currentMaterialSeclet[0] = true;
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
							pnodeId: $scope.VM.version[0] ? $scope.VM.version[0].id:''
						}, function(data) {
							console.log("books：", data.data);
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
					//缓存用户当前 教材
					$localStorage.currentMaterial =  $scope.VM.currentMaterial;
					//选中
					_.each($scope.VM.material, function(v, i) {
						$scope.VM.currentMaterialSeclet[i] = false;
					})
					$scope.VM.currentMaterialSeclet[index] = true;
					$scope.$emit("currentTreeId", $scope.VM.currentMaterial.id);
					
				}


			$scope.close = function() {
				$uibModalInstance.close();
			}



			$scope.editDone = function() {
				console.log($scope.res);
				$uibModalInstance.close($scope.res);
			}
		}])
}());

//问题：编辑我的上传资源UI，接口在上传资源位置
