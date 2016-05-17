// 消息弹出框
(function() {
	'use strict';
	angular.module('webApp.core.services')
		.factory('ModalMsg', ['$uibModal',function service($uibModal) {
			var tplLeft = '<div class="modal-body confirm-modal-body"><div class="confirm-modal-content"><div class="modal-inner-content">';	
			var alertRight = '</div><button class="btn btn-lg btn-success btn-custom-modal" ng-click="cancelModal()">确定</button></div></div>';
			var confirmRight = '</div><button class="btn btn-lg btn-custom-modal btn-warning" ng-click="OK()">确定</button><button class="btn btn-lg btn-success btn-custom-modal" ng-click="cancelModal()">取消</button></div></div>';
			var loggerRight = '</div></div></div>';
			return {
				/** 消息提示 弹出框*/
				'alert': function alert(key) {
					return $uibModal.open({
						template: tplLeft + key + alertRight,
						windowClass: "alert-modal",
//						size: 'sm',
						controller: ['$uibModalInstance', '$scope', function($uibModalInstance,$scope) {
							$scope.cancelModal = function(){
								$uibModalInstance.dismiss('cancel');
							}
						}]
					});
				},
				'confirm': function confirm(key) {
					return $uibModal.open({
						template: tplLeft + key + confirmRight,
						windowClass: "confirm-modal",
//						size: 'lg',
						controller: ['$uibModalInstance', '$scope', function($uibModalInstance,$scope) {
							$scope.cancelModal = function(){
								$uibModalInstance.dismiss('cancel');
							}
							$scope.OK = function(){
								$uibModalInstance.close(true);
							}
						}]
					});
				},
				/** 消息提示 弹出框*/
				'logger': function logger(key) {
					return $uibModal.open({
						template: tplLeft + key + alertRight,
						windowClass: "logger-modal",
						controller: ['$uibModalInstance', '$scope', function($uibModalInstance,$scope) {
							setTimeout(function(){
								$uibModalInstance.dismiss('cancel');
							}, 3000);
							$scope.cancelModal = function(){
								$uibModalInstance.dismiss('cancel');
							}
						}]
					});
				},
				/** 不兼容ie的 弹出框 只在chorme下弹出，其他浏览器用原生的*/
				'chromeLogger': function logger(key) {
					return $uibModal.open({
						template: tplLeft + key + alertRight,
						windowClass: "logger-modal",
						controller: ['$uibModalInstance', '$scope', function($uibModalInstance,$scope) {
							setTimeout(function(){
									$uibModalInstance.dismiss('cancel');
								}, 3000);
								$scope.cancelModal = function(){
									$uibModalInstance.dismiss('cancel');
								}
							if (navigator.userAgent.indexOf("Chrome") == -1) {
								var bodyHeight=$(document).height();
								$("html, body").animate({scrollTop:bodyHeight + 'px'},"slow");
							}
						}]
					});
				},
				 
				/** 错误处理*/
				'error': function logger(key) {
					return $uibModal.open({
						template: tplLeft + key.message + alertRight,
						windowClass: "logger-modal",
						controller: ['$uibModalInstance', '$scope', function($uibModalInstance,$scope) {
							setTimeout(function(){
								$uibModalInstance.dismiss('cancel');
							}, 3000)
						}]
					});
				}
			};
		}]);
}());
