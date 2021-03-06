/**
 * 个人中心模块
 */
(function() {
	'use strict';
	//Module configuration
	angular.module('webApp.coms.personalcenter')
		.controller("myCommentCtrl", ['$scope', '$stateParams', '$state', '$location', '$localStorage', 'ModalMsg', 'Res', 'Personal',
			function($scope, $stateParams, $state, $location, $localStorage, ModalMsg, Res, Personal) {
				// 用户信息
				$scope.user = $localStorage.authUser;
				$scope.btnShow=true;
				$scope.isLoading=true;
				$scope.commentState = [{
						"name": "已评价",
						"state": "1"
				},
					{"name":"待评价","state":"0"}
				];
				$scope.VM.stateNum = [];
				$scope.curState = [];
				$scope.curState[0] = true;
				$scope.VM.stateId=1;
				
				//切换评论状态
				$scope.selectState=function(state,index){
					$scope.isLoading=true;
					_.each($scope.commentState, function(v, i) {
						$scope.curState[i] = false;
					});
					$scope.curState[index] = true;
					$scope.VM.stateId=state;
					$scope.VM.bigCurrentPage = 1;
					if(state=="1")
					{
						$scope.btnShow=true;
						getComList();
					}else if(state=="0")
					{
						$scope.btnShow=false;
						getUnreview();	
					}
				}
				//评分等级切换
				$scope.gradeList = [{
						"name": "全部",
						"type": 0
					}, {
						"name": "好评",
						"type": 1
					}, {
						"name": "中评",
						"type": 2
					}, {
						"name": "差评",
						"type": 3
					}
				];
				$scope.isChecked = [];
				$scope.isChecked[0] = true;
				$scope.VM.curChecked = $scope.gradeList[0].type;
				//切换等级
				$scope.selectGrade = function(type) {
					$scope.isLoading=true;
					// console.log( type)
					$scope.VM.curChecked = type;
					$scope.VM.bigCurrentPage = 1;
					
					if($scope.VM.stateId=="1")
					{
						getComList();
					}else if($scope.VM.stateId=="0")
					{
						getUnreview();
					}
				}
				
				//获取评论
				$scope.VM.bigCurrentPage = 1;

				var getComList = function () {
					// console.log( $scope.VM.curChecked)
					Personal.getComment({
						reviewType: $scope.VM.curChecked,
						page: $scope.VM.bigCurrentPage,
						perPage: 10
					}, function(data) {
						$scope.isLoading=false;
						// console.log("我的评论")
						// console.log(data.data)
						$scope.bigTotalItems = data.data.totalLines;
						$scope.VM.commentList = data.data.list;
						$scope.total = data.data.total;
						$scope.VM.stateNum[0] = "(" + $scope.bigTotalItems + ")";
					});
				}
				getComList();
				
				//未评价
				function getUnreview(){
					Personal.getUnreview({
						reviewType: $scope.VM.curChecked,
						page: $scope.VM.bigCurrentPage,
						perPage: 10
					}, function(data) {
						$scope.isLoading=false;
						$scope.bigTotalItems = data.data.totalLines;
						$scope.VM.commentList = data.data.list;
						$scope.total = data.data.total;
						$scope.VM.stateNum[1] = "(" + $scope.bigTotalItems + ")";
					});
				}
				
				//改变页数
				$scope.changePage = function() {
					if($scope.VM.stateId=="1")
					{
						getComList();
					}else
					{
						getUnreview();
					}
				}
					//转到
				$scope.pageTo = $scope.bigCurrentPage;
				$scope.pageChanged = function(pagenum) {
					if(!!pagenum &&pagenum.split('.').length > 1){
						ModalMsg.logger("请输入正整数");
						return;
					}
					$scope.VM.bigCurrentPage = pagenum;
					if($scope.VM.stateId=="1")
					{
						getComList();
					}else if(pagenum > 0 && pagenum <= $scope.total)
					{
						getUnreview();
					}else {
						ModalMsg.logger("请输入大于0，小于页码总数的正整数~");
					} 
					
				};

				//删除评论
				$scope.deleteCom = function($event,list, index) {
					$event.stopPropagation();
					var deleteModal = ModalMsg.confirm("确定删除评论：" +list.content);

					deleteModal.result.then(function(data) {
						Personal.delCom({
							ids: list.id,
							_method: "DELETE"
						}, function(data) {
							$scope.VM.commentList.splice(index,1);
						});
					})
					
				}

			}
		])
}());