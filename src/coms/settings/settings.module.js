/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.settings')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('settings', {
						url: '/settings',
						views: {
							'content@': {
								templateUrl: '/coms/settings/views/settings.html',
								controller: 'SettingsController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header3.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('User', ['$resource',
			function($resource) {
				return $resource(window.BackendUrl+"/resRestAPI/v1.0/users/:userid",{
                    userid: '@_id'
                },{
					getUser: {method: "GET",url: window.BackendUrl + "/resRestAPI/v1.0/users/"},
					getAllTerms: {method: "GET", url: window.BackendUrl + "/resRestAPI/v1.0/terms"},
					getAllSubjects: {method: "GET", url: window.BackendUrl + "/resRestAPI/v1.0/subjects"},
					setUserInfo: {method: "POST", url: window.BackendUrl + "/resRestAPI/v1.0/users/:userid", params: {userid: '@userid'}},
				})
			}
		])
		.controller("SettingsController", ['$scope', '$stateParams', '$state', '$location', '$uibModal', 'User','$localStorage',
			function($scope, $stateParams, $state, $location, $uibModal,User,$localStorage) {
				
				//当前学段
				$scope.currentTerm = {
				}
				//学科选择列表
				$scope.subjects = [];
				//选中的学段
				$scope.selectedTerm;
				//选中的学科
				$scope.selectedSubject;
				
				
				
				//获取用户信息
				User.get({
					userid: $localStorage.authUser.userId
				}, function(data){
					var info = data.data;
					console.log(data);
					$scope.userName = info.userName;
					$scope.schoolName = info.schoolName;
					$scope.trueName = info.trueName;
					$scope.sexSelected = info.male;
					$scope.userImage = info.userImage;
					//获取学段信息
					User.getAllTerms({
						
					}, function(data) {
						$scope.terms = data.data;
						if($scope.terms) {
							for(var i = 0; i < $scope.terms.length; i ++) {
								if($scope.terms[i].name == info.termName) {
									$scope.terms[i].active = true;
									$scope.selectedTerm = $scope.terms[i];
								}
								else $scope.terms[i].active = false;
							}
							User.getAllSubjects({
								termId: $scope.selectedTerm.id
							}, function(data) {
								console.log(data.data);
								$scope.subjects = data.data;
								if($scope.subjects && $scope.subjects.length > 0) {
									if(info.subjectNames) {
										for(var i = 0; i < $scope.subjects.length; i ++) {
											if($scope.subjects[i].name == info.subjectNames) {
												$scope.subjects[i].active = true;
												$scope.selectedSubject = $scope.subjects[i];
											}
											else $scope.subjects[i].active = false;
										}
									}
									else {
										$scope.subjects[0].active = true;
										$scope.selectedSubject = $scope.subjects[0];
									}
								}
							})
						}
					})
				})
				
				
				// 变量共享
				$scope.VM = {};
				
				//修改信息modifyInfoJson
				var infojson = {
					
				}
				
				$scope.selectTerm = function(index) {
					for(var i = 0; i < $scope.terms.length; i ++) $scope.terms[i].active = false;
					$scope.terms[index].active = true;
					$scope.selectedTerm = $scope.terms[index];
					User.getAllSubjects({
						termId: $scope.selectedTerm.id
					}, function(data) {
						console.log(data.data);
						$scope.subjects = data.data;
						if($scope.subjects && $scope.subjects.length > 0) {
							$scope.subjects[0].active = true;
							$scope.selectedSubject = $scope.subjects[0];
						}
					})
				}
				
				
				$scope.selectSubject = function(index) {
					for(var i = 0; i < $scope.subjects.length; i ++) $scope.subjects[i].active = false;
					$scope.subjects[index].active = true;
					$scope.selectedSubject = $scope.subjects[index];
				}
				
				$scope.setMale = function(male) {
					$scope.sexSelected = male;
				}
				
				$scope.saveUserInfo = function() {
					var saveSuccess = "保存成功";
					var btnSave = "确定";
					User.setUserInfo({
						userid: $localStorage.authUser.userId,
						userImage: $scope.userImage,
						trueName: $scope.trueName,
						termId: $scope.selectedTerm.id,
						subjectId: $scope.selectedSubject.id,
						male: $scope.sexSelected,
						_method: "PATCH"
					}, function(data) {
						if(data) {
							$scope.VM.messageModal = $uibModal.open({
								templateUrl: "message.html",
								controller: "messageInstanceController",
								size: 'sm',
								resolve: {
									messageContent: function() {
										return saveSuccess;
									},
									buttonContent: function() {
										return btnSave;
									}
								}
							})
						}
					})
				}
				
				
				
				
				$scope.changeAvatar = function() {
					$scope.VM.avatarModal = $uibModal.open({
			      	templateUrl: 'avatar.html',
			      	controller: 'avatarInstanceController',
			      	size: '',
			      	resolve: {
			      		}
	    			});	
				}
			}
		])
		.controller('avatarSettingController', ['$scope', '$uibModal',
			function($scope, $uibmodal) {
				//变量共享
				
			}
		])
		.controller('avatarInstanceController', ['$scope', '$uibModalInstance',
			function($scope, $uibModalInstance) {
				$scope.panelOneShow = true;
				$scope.panelTwoShow = false;
				$scope.panelThreeShow = false;
				
				$scope.showPanel = function(index) {
					if(index == 1) {
						$scope.panelOneShow = true;
						$scope.panelTwoShow = false;
						$scope.panelThreeShow = false;
					}
					else if(index == 2) {
						$scope.panelOneShow = false;
						$scope.panelTwoShow = true;
						$scope.panelThreeShow = false;
					}
					else {
						$scope.panelOneShow = false;
						$scope.panelTwoShow = false;
						$scope.panelThreeShow = true;
					}
				}
				
				$scope.close = function() {
					$uibModalInstance.close();
				}
			}
		])
		
		.controller('messageInstanceController', ['$scope', '$uibModalInstance', 'messageContent', 'buttonContent',
			function($scope, $uibModalInstance, messageContent, buttonContent) {
				$scope.messageContent = messageContent;
				$scope.buttonContent = buttonContent;
				
				$scope.close = function() {
					$uibModalInstance.close();
				}
			}
		])
		
}());