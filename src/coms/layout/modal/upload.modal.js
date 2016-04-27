/**
 * 上传
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.modal')
		.controller("uploadResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage', '$uibModal', 'ModalMsg', 'Res', 'Upload', '$timeout', '$uibModalInstance',
			function($scope, $stateParams, $state, $location, $localStorage, $uibModal, ModalMsg, Res, Upload, $timeout, $uibModalInstance) {
				// 用户信息
				$scope.user = $localStorage.authUser;

				//可上传的格式
				window.typeConfirm();
				$scope.formats = window.allFormats.toString();

				// 获取上传地址
				$scope.uploadDisable = true;
				$scope.uploadFinish = true;
				Res.getUploadUrl({}, function(data) {
					$scope.uploadData = data.data;
					$scope.uploadDisable = false;
					// console.log("uploadData:", $scope.uploadData);		
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
					if (errFiles.length > 0) {
						ModalMsg.logger("文件格式不正确，请重新选择！");
						return;
					}

					$scope.firstUpload = false;
					$scope.files = files;

					angular.forEach($scope.files, function(file) {
						// console.log(file)
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
								// console.log(response.data)
							});
						}, function(response) {
							// console.log(response.data)
							if (response.status > 0)
								$scope.errorMsg = response.status + ': ' + response.data;
						}, function(evt) {
							file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
							$scope.progress = file.progress;
							// 上传完成
							console.log($scope.progress)
							if ($scope.progress > 96) {
								$timeout(function() {
									console.log($scope.progress)
									$scope.uploadFinish = false;
								}, 1000)
							}
							//							
						});
					});
				}

				// 上传
				$scope.uploadResInfo = function(isWeb) {
					$localStorage.uploadData = $scope.uploadData;
					var files = [];
					//本地
					if (!isWeb) {
						$localStorage.isWeb = false;
						// localstorage不支持file对象？ 转存一下
						_.each($scope.files, function(v, i) {
							// console.log(v)
							var tmp = {};
							tmp.name = v.name;
							tmp.responseName = v.result;
							tmp.size = v.size;
							files = files.concat(tmp);
						})

					} else {
						//web
						$localStorage.isWeb = true;
						var tmp = {};
						tmp.name = $scope.uploadWebUrl;
						tmp.responseName = $scope.uploadWebUrl;
						tmp.size = 0;
						files = files.concat(tmp);
					}
					$localStorage.files = files;

					// 打开资源信息编辑
					var openModal = function() {
							setTimeout(function() {
								var modalNewUploadInfo = $uibModal.open({
										templateUrl: "eiditResModal.html",
										windowClass: "upload-modal",
										controller: 'editResController',
										// scope: $scope //Refer to parent scope here
									})
									//上传返回处理
								modalNewUploadInfo.result.then(function(data) {
									console.log("receive", data)
									$uibModalInstance.close(data);
								});
							}, 300)
						}
						// 根据后缀名 获取资源类型
						//本地
					if (!isWeb) {
						Res.unifyType4ext({
							ext: '.' + files[0].name.split('.')[files[0].name.split('.').length - 1]
						}, function(data) {
							$localStorage.unifyType = data.data;
							openModal();
						})
					} else {
						// 默认
						$localStorage.unifyType = [{
							"id": 2,
							"mtype": "文本素材",
							"code": "FL0101"
						}];
						openModal();
					}

				}
			}
		])
		// 编辑资源信息
		.controller("editResController", ['$scope', '$stateParams', '$state', '$location', '$localStorage', '$uibModalInstance', 'ModalMsg', 'Res', 'Upload', '$timeout', 'Tree',
			function($scope, $stateParams, $state, $location, $localStorage, $uibModalInstance, ModalMsg, Res, Upload, $timeout, Tree) {
				//变量共享
				$scope.VM = {};
				$scope.showHeader = true;
				$scope.uploadData = $localStorage.uploadData;
				$scope.uploadFilesData = $localStorage.files;

				$scope.unifyType = $localStorage.unifyType;

				// 批量上传
				$scope.addAll = false;
				if ($scope.uploadFilesData.length > 1) {
					$scope.addAll = true;
				}

				//根据上传后缀名确定 上传类型
				var fileType = $scope.uploadFilesData[0].name.split('.')[$scope.uploadFilesData[0].name.length - 1]

				// 监听目录树变化
				var getTreeData = function() {
					Tree.getTree({
						pnodeId: $localStorage.currentMaterial.id,
					}, function(data) {
						$scope.treedataSelect = data.data;

						$scope.currentNode = data.data[0];
						//展开第一个节点
						$scope.expandedNodes = [$scope.treedataSelect[0]];
						// console.log("tree data:", data.data);
					})
				}

				// 目录树 控制
				$scope.showTree = false;
				$scope.treeTrigger = function() {
					$scope.showTree = true;
				}
				$scope.closeThis = function() {
					$scope.showTree = false;
				}

				// 目录树节点选择
				$scope.currentNode = $localStorage.currentTreeNode;

				$scope.showSelected = function(sel) {
					$scope.currentNode = sel;
					//获取当前节点下的所有备课夹
				};

				// 数据初始化
				$scope.res = {};
				$scope.res.title = $scope.uploadFilesData[0].name.split('.')[0];
				$scope.res.keywords = '';
				$scope.res.description = '';
				$scope.res.paths = !!$localStorage.isWeb ? $scope.uploadFilesData[0].responseName : $scope.uploadData.uploadPath + $scope.uploadFilesData[0].responseName;
				$scope.res.sizes = $scope.uploadFilesData[0].size;
				$scope.res.iscoursewares = 0;
				$scope.res.islocals = !!$localStorage.isWeb ? 1 : 0;

				$scope.uploadEditResInfo = function() {
					if (!$scope.res.title) {
						ModalMsg.logger("资源名称不能为空");
						return;
					}
					if (!$scope.res.keywords) {
						ModalMsg.logger("关键词不能为空");
						return;
					}
					// path生成失败，需重试
					if (!$scope.uploadFilesData) {
						$scope.uploadFilesData = $localStorage.files;
						ModalMsg.logger("上传文件路径获取不成功，请重试");
						return;
					};
					// 资源类型失败，默认为素材
					if (!$scope.unifyType) {
						$scope.unifyType = [{
							"id": 2,
							"mtype": "文本素材",
							"code": "FL0101"
						}];
					};

					// 统一批量上传
					if (!!$scope.addAll) {
						var names = [];
						var tfCodes = [];
						var unifTypeIds = [];
						var scopes = [];
						var keywords = [];
						var descs = [];
						var sizes = [];
						var paths = [];
						var iscoursewares = [];
						var islocals = [];

						_.each($scope.uploadFilesData, function(v, i) {
							// console.log(v.name.split('.')[0])
							names.push(v.name.split('.')[0]);
							tfCodes.push($scope.currentNode.tfcode);
							unifTypeIds.push($scope.unifyType[$scope.currentTypeIndexSeclet].id);
							scopes.push($scope.currentScopeIndexSeclet);
							keywords.push($scope.res.keywords);
							descs.push($scope.res.description);
							paths.push($scope.uploadData.uploadPath + $scope.uploadFilesData[0].responseName);
							sizes.push(v.size);
							iscoursewares.push(0);
							islocals.push(0);
						})

						$scope.res.title = names.toString();
						$scope.currentNode.tfcode = tfCodes.toString();
						$scope.unifyType[$scope.currentTypeIndexSeclet].id = unifTypeIds.toString();
						$scope.currentScopeIndexSeclet = scopes.toString();
						$scope.res.keywords = keywords.toString();
						$scope.res.description = descs.toString();
						$scope.res.paths = paths.toString();
						$scope.res.sizes = sizes.toString();
						$scope.res.iscoursewares = iscoursewares.toString();
						$scope.res.islocals = islocals.toString();
					}

					Res.resCtrl({
						names: $scope.res.title,
						unifTypeIds: $scope.unifyType[$scope.currentTypeIndexSeclet].id,
						tfcodes: $scope.currentNode.tfcode,
						scopes: $scope.currentScopeIndexSeclet,
						keywords: $scope.res.keywords,
						descs: $scope.res.description ? $scope.res.description.toString() : ' ',
						paths: $scope.res.paths,
						sizes: $scope.res.sizes,
						iscoursewares: $scope.res.iscoursewares,
						islocals: $scope.res.islocals
					}, function(data) {
						if (data.code == "OK") {
							// $uibModalInstance.dismiss('cancel');
							console.log(data.data);
							$uibModalInstance.close(data.data);
							// ModalMsg.logger("上传成功啦");
							// 上传资源 列表
							//							setTimeout(function(){
							//								window.location.reload();
							//							}, 1000)

						} else {
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
						// console.log(data);
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
								// console.log("学科：", data.data)
						}).$promise;
					})
					.then(function(data) {
						return Res.getEditions({
							termId: $localStorage.currentGrade.id,
							subjectId: $localStorage.currentSubject.id
						}, function(data) {
							// console.log("版本：", data.data);
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
								// console.log("books：", data.data);
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
								getTreeData();

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
							// console.log("books：", data.data);
							$scope.VM.material = data.data;
							//缓存用户当前 教材
							$localStorage.currentMaterial = $scope.VM.material[0];
							//回归第一个
							_.each($scope.VM.material, function(v, i) {
								$scope.VM.currentMaterialSeclet[i] = false;
							})
							$scope.VM.currentMaterial = $scope.VM.material[0];
							$scope.VM.currentMaterialSeclet[0] = true;

							getTreeData();
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
						// console.log("版本：", data.data);
					}).$promise.then(function(data) {
						return Res.getBooks({
							pnodeId: $scope.VM.version[0] ? $scope.VM.version[0].id : ''
						}, function(data) {
							// console.log("books：", data.data);
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
							getTreeData();
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
						// console.log("books：", data.data);
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

					getTreeData();

				}

				// 资源类型选择
				$scope.currentTypeSeclet = [];
				$scope.currentTypeSeclet[0] = true;
				$scope.currentTypeIndexSeclet = 0;
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
					_.each([0, 1, 2], function(v, i) {
						$scope.currentScopeSeclet[i] = false;
					})
					$scope.currentScopeSeclet[index] = true;
					$scope.currentScopeIndexSeclet = index;
				}
			}
		])

	// 再次编辑资源信息
	.controller("editResInstanceCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage', '$uibModalInstance', 'ModalMsg', 'Res', 'Upload', '$timeout', 'Tree', 'resitem', 'resDetails',
		function($scope, $stateParams, $state, $location, $localStorage, $uibModalInstance, ModalMsg, Res, Upload, $timeout, Tree, resitem, resDetails) {
			//变量共享
			$scope.VM = {};
			$scope.showHeader = false;
			$scope.res = resitem;
			$scope.resDetails = resDetails;
			// 关键词 
			$scope.res.keywords = $scope.resDetails.keyword;
			$scope.res.description = $scope.resDetails.assetdesc;
			console.log("resitem", resitem, resDetails);

			// 获取并定位资源类型
			Res.unifyType4ext({
				ext: '.' + $scope.res.fileSuffix
			}, function(data) {
				$scope.unifyType = data.data;
				var index = typeIndex();
				$scope.currentTypeSeclet[index] = true;
				$scope.currentTypeIndexSeclet = index;
			})

			// 定位资源类型 当前选择
			var typeIndex = function() {
				var index = 0;
				_.each($scope.unifyType, function(v, i) {
					console.log(v.mtype, $scope.res.unifyType);

					if (v.mtype == $scope.res.unifyType) {
						index = i;
					}
				})
				return index;
			}

			// 资源类型选择
			$scope.currentTypeSeclet = [];
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
			$scope.currentScopeSeclet[$scope.resDetails.sharescope] = true;
			$scope.currentScopeIndexSeclet = $scope.resDetails.sharescope;
			$scope.selectScope = function(index) {
				//选中
				_.each([0, 1, 2], function(v, i) {
					$scope.currentScopeSeclet[i] = false;
				})
				$scope.currentScopeSeclet[index] = true;
				$scope.currentScopeIndexSeclet = index;
			}
			
			

			// 监听目录树变化
			var getTreeData = function() {
				Tree.getTree({
					pnodeId: $localStorage.currentMaterial.id,
				}, function(data) {
					$scope.treedataSelect = data.data;

					$scope.currentNode = data.data[0];
					//展开第一个节点
					$scope.expandedNodes = [$scope.treedataSelect[0]];
					// console.log("tree data:", data.data);
				})
			}

			// 目录树 控制
			$scope.showTree = false;
			$scope.treeTrigger = function() {
				$scope.showTree = true;
			}
			$scope.closeThis = function() {
				$scope.showTree = false;
			}

			// 目录树节点选择
			$scope.currentNode = $localStorage.currentTreeNode;

			$scope.showSelected = function(sel) {
				$scope.currentNode = sel;
				//获取当前节点下的所有备课夹
			};

			$scope.uploadEditResInfo = function() {
				if (!$scope.res.title) {
					ModalMsg.logger("资源名称不能为空");
					return;
				}
				if (!$scope.res.keywords) {
					ModalMsg.logger("关键词不能为空");
					return;
				}

				// 上传
				Res.editUploadRes({
					_method: 'PUT',
					id: $scope.res.resId,
					name: $scope.res.title,
					unifTypeId: $scope.unifyType[$scope.currentTypeIndexSeclet].id,
					tfcode: $scope.currentNode.tfcode,
//					scopes: $scope.currentScopeIndexSeclet,
					keyword: $scope.res.keywords?$scope.res.keywords:' ',
					desc: $scope.res.description ? $scope.res.description.toString() : ' ',
					path: $scope.resDetails.assetpath,
					size: $scope.resDetails.assetsize?$scope.resDetails.assetsize:' '
				}, function(data) {
					if (data.code == "OK") {
						// $uibModalInstance.dismiss('cancel');
						console.log(data.data);
						$uibModalInstance.close(data.data);
					} else {
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
					// console.log(data);
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
							// console.log("学科：", data.data)
					}).$promise;
				})
				.then(function(data) {
					return Res.getEditions({
						termId: $localStorage.currentGrade.id,
						subjectId: $localStorage.currentSubject.id
					}, function(data) {
						// console.log("版本：", data.data);
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
							// console.log("books：", data.data);
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
							getTreeData();

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
						// console.log("books：", data.data);
						$scope.VM.material = data.data;
						//缓存用户当前 教材
						$localStorage.currentMaterial = $scope.VM.material[0];
						//回归第一个
						_.each($scope.VM.material, function(v, i) {
							$scope.VM.currentMaterialSeclet[i] = false;
						})
						$scope.VM.currentMaterial = $scope.VM.material[0];
						$scope.VM.currentMaterialSeclet[0] = true;

						getTreeData();
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
					// console.log("版本：", data.data);
				}).$promise.then(function(data) {
					return Res.getBooks({
						pnodeId: $scope.VM.version[0] ? $scope.VM.version[0].id : ''
					}, function(data) {
						// console.log("books：", data.data);
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
						getTreeData();
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
					// console.log("books：", data.data);
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

				getTreeData();

			}
		}
	])
}());