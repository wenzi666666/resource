/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.previewres')
		.controller("resCommentCtrl", ['$scope', '$stateParams', '$state', '$location', 'Preview', '$localStorage', 'ModalMsg',
			function($scope, $stateParams, $state, $location, Preview, $localStorage, ModalMsg) {

				//星星 评分
				$scope.showStar = [1, 2, 3, 4, 5];
				$scope.curStar = [];
				$scope.hoverStar = [];
				$scope.mouseOverStar = function(index) {
					var len = 0;
					_.each($scope.curStar, function(v, i) {
						if ($scope.curStar[i] == true) {
							len++;
						}
					});
					if (len == 0) {
						//加上颜色 starHover;
						for (var i = 0; i <= index; i++) {
							$scope.hoverStar[i] = true;
						}
					}
				}
				$scope.mouseOutStar = function(index) {
					var len = 0;
					_.each($scope.curStar, function(v, i) {
						if ($scope.curStar[i] == true) {
							len++;
						}
					});
					if (len == 0) {
						for (var i = 0; i <= index; i++) {
							$scope.hoverStar[i] = false;
						}
					}
				}

				$scope.starClick = function(index) {
					var len = 0;
					for (var i = 0; i < $scope.curStar.length; i++)
						_.each($scope.curStar, function(v, i) {
							if ($scope.curStar[i] == true) {
								len++;
							}
						});
					if (len == 0) {
						publishScore(index + 1);
					} else {
						ModalMsg.logger("您已经评分过了，不能再次评分")
					}
				}

				//获取单个资源的详细信息/评论
				$scope.VM.listInfoCom = function(id, fromFlag) {
					$scope.VM.resourceId = id;
					Preview.listInfo({
						resId: id,
						fromFlag: fromFlag

					}, function(data) {
						if (data.code == "OK") {
							console.log(data.data)
							$scope.VM.info = data.data;
							for (var i = 0; i < $scope.VM.info.score; i++) {
								//几颗星亮
								$scope.curStar[i] = true;
							}
						} else {
							alert(data.code);
						}

					});
					//获取播放链接
					Preview.resViewUrl({
						resIds: id,
						fromFlags: fromFlag

					}, function(data) {
						if (data.code == "OK") {
							console.log(data);
							var tpl = "";
							tpl = "<iframe width='100%' height='700px' src='" + data.data[0].path + "' style='border:0'></iframe>"
							$('#res-slide-content').html(tpl);
						} else {
							alert(data.code);
						}

					});
					//获取对应评论
					getComment(id);
				}

				//获取所有评论
				$scope.userName = $localStorage.authUser.userName;
				$scope.contentShow=[];
				function getComment(id) {
					Preview.myComment({
						resId: id,
						fromFlag: $localStorage.fromFlag,
					}, function(data) {

						if (data.code == "OK") {
							$scope.myCommentList = data.data;
							
							_.each($scope.myCommentList, function(v, i) {
								$scope.contentShow[i]=true;
								
							});
							console.log("我的评论")
							console.log(data)
						} else {
							alert(data.message);
						}

					});
					//获取其他人的评论
					Preview.otherComment({
						resId: id,
						fromFlag: $localStorage.fromFlag,
					}, function(data) {
						if (data.code == "OK") {
							$scope.otherCommentList = data.data;
							console.log("别人的评论")
							console.log(data)
						} else {
							alert(data.message);
						}
					});

				}

				//评论限制操作
				$scope.commentNum = 200;
				$scope.VM.inputComment = "";
				$scope.changeComment = function() {
					if ($scope.VM.inputComment.length < 201) {
						$scope.commentNum = 200 - $scope.VM.inputComment.length;
					} else {
						$scope.VM.inputComment = $scope.VM.inputComment.substring(0, 200);
					}
				}

				$scope.myShow = true;
				$scope.otherShow = false;
				$scope.changeBlock = function(obj) {
					if (obj == "my") {
						$scope.myShow = true;
						$scope.otherShow = false;

					} else {
						$scope.myShow = false;
						$scope.otherShow = true;
					}
				}

				//发布评论
				$scope.publishComment = function() {
						var score = 0;
						_.each($scope.curStar, function(v, i) {
							if ($scope.curStar[i] == true) {
								score++;
							}
						});
						if (score == 0) {
							ModalMsg.logger("评完分才能评论哦！");
							return false;
						}
						Preview.editComment({
							resId: $scope.VM.resourceId,
							displayContent: $scope.VM.inputComment,
							fromFlag: $localStorage.fromFlag,
							ascore: score,
							isScore: 1
						}, function(data) {
							if (data.code == "OK") {
								getComment($scope.VM.resourceId); //获取我的评论
								$scope.VM.inputComment = "";

							} else {
								alert(data.message);
							}
						});
					}
				//发布评分
				function publishScore(index) {
					console.log(index)
					Preview.editComment({
						resId: $scope.VM.resourceId,
						displayContent: "",
						fromFlag: $localStorage.fromFlag,
						ascore: index,
						isScore: 0
					}, function(data) {
						if (data.code == "OK") {
							for (var i = 0; i < index; i++) {
								$scope.curStar[i] = true;
							}
						} else {
							alert(data.message);
						}
					});
				}

				//删除评论
				$scope.deleteCom = function(id) {
						Preview.editComment({
							commentId: id,
							_method: "DELETE"
						}, function(data) {
							console.log(data)
							if (data.code == "OK") {
								getComment($scope.VM.resourceId); //获取我的评论
							} else {
								alert(data.message);
							}
						});

					}
				//编辑评论
				
				
				$scope.editCom = function(id,index) {
					_.each($scope.contentShow, function(v, i) {
						$scope.contentShow[i]=true;
					});
					$scope.contentShow[index]=false;
					$scope.editSure = function(index) {
							Preview.editComment({
								displayContent:$scope.myCommentList[index].acontent,
								commentId: id,
								_method: "PATCH"
							}, function(data) {
								if (data.code == "OK") {
									getComment($scope.VM.resourceId); //获取我的评论
									_.each($scope.contentShow, function(v, i) {
										$scope.contentShow[i]=true;
									});
									
								} else {
									alert(data.message);
								}

							});
						}
					//取消
					$scope.offModal = function($index) {
						_.each($scope.contentShow, function(v, i) {
							$scope.contentShow[i]=true;
						});
						
					}
				}

			}
		])
}());