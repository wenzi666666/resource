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
				$scope.perPage = 10;
				$scope.maxSize = 3;
				var page = 1;
				// 上传资源 列表
				

				//获取上传资源
				$scope.getResList = function() {
					Res.getUploadRes({
						unifyTypeId: '1',
						fileFormat: '全部',
						page: $scope.VM.currentPage,
						perPage: $scope.perPage
					}, function(data) {
						// console.log("uploadList:", data.data)
						$scope.VM.uploadFileList = data.data;
						$scope.totalItems = data.data.totalLines;
						// console.log($scope.totalItems);
					})
				}

				$scope.getResList();

				//获取所有资源类型
				Personal.getResType({}, function(data) {
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
						size: '',
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
					if(pagenum == undefined) {
						$scope.getResList();
					}
					else {
						$scope.VM.currentPage = pagenum;
						$scope.getResList();
					}
				}
			}
		])

		.controller('editUploadResCtrl', ['$scope', function($socpe) {

		}])

		.controller('editResInstanceCtrl', ['$scope', '$uibModal', '$uibModalInstance', 'Res', 'resitem', function($scope, $uibModal, $uibModalInstance, Res, resitem) {
			
			//变量共享
			$scope.VM = {};
			$scope.res = {};

			$scope.res.unifyType = resitem.unifyType;

			//学段、学科、版本和课本级联

			//选择学段
			$scope.selectTerm = function(term) {
				var id = JSON.parse(term);
				console.log(JSON.parse(term));
				Res.getSubjects({
					termId: id
				}, function(data) {
					$scope.VM.subjects = data.data;
					console.log("subjects:",$scope.VM.subjects);
					Res.getEditions({
						termId: $scope.VM.terms[0].id,
						subjectId: $scope.VM.subjects[0].id
					}, function(data) {
						$scope.VM.versions = data.data;
						console.log("verisons:",$scope.VM.versions);
						Res.getBooks({
							pnodeId: $scope.VM.versions[0].id
						}, function(data) {
							$scope.VM.books = data.data;
							console.log("books:",$scope.VM.books);
						})
					})
				})
			}


			Res.getTerms({

			}, function(data) {
				$scope.VM.terms = data.data;
				$scope.curTerm = $scope.VM.terms[0];
				console.log("terms:",$scope.VM.terms);
				Res.getSubjects({
					termId: $scope.VM.terms[0].id
				}, function(data) {
					$scope.VM.subjects = data.data;
					console.log("subjects:",$scope.VM.subjects);
					Res.getEditions({
						termId: $scope.VM.terms[0].id,
						subjectId: $scope.VM.subjects[0].id
					}, function(data) {
						$scope.VM.versions = data.data;
						console.log("verisons:",$scope.VM.versions);
						Res.getBooks({
							pnodeId: $scope.VM.versions[0].id
						}, function(data) {
							$scope.VM.books = data.data;
							console.log("books:",$scope.VM.books);
						})
					})
				})
			});

			


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
