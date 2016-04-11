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
						template: tplLeft + key + loggerRight,
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
