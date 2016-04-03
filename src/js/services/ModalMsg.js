// 消息弹出框
(function() {
	'use strict';
	angular.module('webApp.core.services')
		.factory('ModalMsg', ['$uibModal', function service($uibModal) {
			var tplLeft = '<div class="modal-body confirm-modal-body"><div class="confirm-modal-content"><div class="modal-inner-content">';	
			var tplRight = '</div><button class="btn btn-lg btn-success btn-custom-modal" onclick="cancel()">确定</button></div></div>';
			return {
				/** 消息提示 弹出框*/
				'alert': function alert(key) {
					return $uibModal.open({
						template: tplLeft + key + tplRight,
						size: 'sm',
						controller: function() {
							window.cancel = function(){
								console.log("cancel")
								 $('div[modal-render]').remove();
//								 $('.modal-backdrop.in').css({'opacity':0, 'z-index':-1});
								 z
							}
						}
					});
				},
				'confirm': function confirm(key) {
					
				},
				/** 消息提示 弹出框*/
				'logger': function logger(key) {
					
				}
			};
		}]);
}());
