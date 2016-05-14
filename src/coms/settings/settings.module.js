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
					setNewPasswd: {method: "POST", url: window.BackendUrl + "/resRestAPI/v1.0/users/password/"},
					setUserAvatar: {method: "POST", url: window.BackendUrl + "/resRestAPI/v1.0/users/userimage/:userid", params: {userid: '@userid'}}
                })
			}
		])
		.controller("SettingsController", ['$scope', '$stateParams', '$state', '$location', '$uibModal', 'User','$localStorage','ModalMsg',
			function($scope, $stateParams, $state, $location, $uibModal,User,$localStorage,ModalMsg) {
				
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
				setTimeout(function(){
					User.get({
						userid: $localStorage.authUser.userId
					}, function(data){
						var info = data.data;
						$scope.userName = info.userName;
						$scope.schoolName = info.schoolName;
						$scope.trueName = info.trueName;
						$scope.sexSelected = info.male;
						$scope.currentAvatar = info.userImage;
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
				},300)
				
				// 更新用户 信息
				var getUserInfo = function() {
					User.get({
						userid: $localStorage.authUser.userId
					}, function(data) {
						// 更新用户信息
						$localStorage.authUser = data.data;
					})
				}
				
				
				// 变量共享
				$scope.VM = {};
				
				
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
					if(male) $scope.sexSelected = "男";
					else $scope.sexSelected = "女";
				}
				
				$scope.saveUserInfo = function() {
					if($scope.trueName.length < 2 || $scope.trueName.length > 20){
						ModalMsg.logger('真实姓名请输入2-20个中英文字符~');
						return;
					}
					var saveSuccess = "保存成功！";
					var btnSave = "确定";
					User.setUserInfo({
						userid: $localStorage.authUser.userId,
						userImage: $scope.userImage,
						trueName: $scope.trueName,
						termId: $scope.selectedTerm.id,
						subjectId: $scope.selectedSubject.id,
						male: $scope.sexSelected == "男" ? true : false,
						_method: "PATCH"
					}, function(data) {
						if(data.code == "OK") {
							ModalMsg.logger(saveSuccess);
							getUserInfo();
						}
					})
				}
				
				//修改头像，弹出模态框
				$scope.changeAvatar = function() {
					$scope.VM.avatarModal = $uibModal.open({
			      	templateUrl: 'avatar.html',
			      	controller: 'avatarInstanceController',
			      	size: '',
			      	resolve: {
			      		}
	    			});	

	  				var saveSuccess = "";
	  				var btnSave = "确定";


	    			$scope.VM.avatarModal.result.then(function(newpath){
	    				console.log(newpath);
		  				if(newpath.length > 0) {
				  			User.setUserAvatar({
				  				userid: $localStorage.authUser.userId,
				  				userImage: newpath
				  			}, function(data) {
				  				console.log(data);
				  				if(data.code == "OK") {
				  					$scope.currentAvatar = newpath;
				  					$localStorage.authUser.userImage = newpath;
				  					saveSuccess = "头像更换成功！";
				  				}
				  				else {
				  					saveSuccess = "头像更换失败，请重新选取！"
				  				}
				  				ModalMsg.logger(saveSuccess);
				  			});
			  			}
			  			else {
			  				return;
			  			}
				    })
				}

				$scope.oldPsw = "";
				$scope.newPsw = "";
				$scope.confirmNewPsw = "";
				//确认密码失败
				$scope.confirmFail = false;
				//修改密码失败
				$scope.setPswFail = false;
				//初始密码错误
				$scope.oldPswError = false;
				//修改密码
				$scope.setPasswd = function() {
					if($scope.confirmNewPsw !== $scope.newPsw) {
						$scope.confirmFail = true;
						$scope.oldPsw = "";
						$scope.newPsw = "";
						$scope.confirmNewPsw = "";
					}
					else if($scope.newPsw == "") {
						$scope.newPswError = true;
						$scope.oldPsw = "";
						$scope.newPsw = "";
						$scope.confirmNewPsw = "";
					}
					else {
						User.setNewPasswd({
							oldPassword: $scope.oldPsw,
							newPassword: $scope.newPsw,
							_method: "PATCH"
						}, function(data) {
							//修改成功
							if(data.code == "OK") {
								var saveSuccess = "密码修改成功，下次请用新密码登录！";
								ModalMsg.logger(saveSuccess);
							} else{
								if(data.code == "InvalidPassword") {
									$scope.oldPswError = true;
									$scope.oldPsw = "";
									$scope.newPsw = "";
									$scope.confirmNewPsw = "";
								}
							}
						})
					}
				}
				
				//清空提示信息
				$scope.initForm = function() {
					$scope.setPswFail = false;
					$scope.newPswError = false;
					$scope.oldPswError = false;
				}
				//重置 
				$scope.clearPasswd = function() {
					$scope.oldPsw = "";
					$scope.newPsw = "";
					$scope.confirmNewPsw = "";
				}
			}
		])
		.controller('avatarSettingController', ['$scope', '$uibModal',
			function($scope, $uibmodal) {
			
				
			}
		])
		.controller('avatarInstanceController', ['$scope', '$uibModalInstance',
			function($scope, $uibModalInstance) {
				// 显示 系统头像
				$scope.isLocal = true;
				
				$scope.panelOneShow = true;
				$scope.panelTwoShow = false;
				$scope.panelThreeShow = false;
				
				//系统头像
				$scope.systemAvatars = [{
					path: "person/head/default.png",
					clicked: true
				},
				{
					path: "person/head/Icon0.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon1.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon2.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon3.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon4.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon5.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon6.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon7.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon8.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon9.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon10.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon11.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon12.jpg", 
					clicked: false
				},
				{
					path: "person/head/Icon13.jpg", 
					clicked: false
				}];
				
				
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

				$scope.lastAvatarSelected = 0;
				$scope.newAvatar = "";

				$scope.selectSystemAvatar = function(index) {
					$scope.systemAvatars[$scope.lastAvatarSelected].clicked = false;
					$scope.systemAvatars[index].clicked = true;
					$scope.lastAvatarSelected = index;
					$scope.newAvatar = $scope.systemAvatars[index].path;
				}

				$scope.setAvatar = function() {
					$uibModalInstance.close($scope.newAvatar);
				}
				
				$scope.close = function() {
					$uibModalInstance.close();
				}
			}
		])	
}());