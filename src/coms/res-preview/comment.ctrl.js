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
					for (var i = 0; i < $scope.curStar.length; i++) {
						_.each($scope.curStar, function(v, i) {
							if ($scope.curStar[i] == true) {
								len++;
							}
						});
					}
					if (len == 0) {
						publishScore(index + 1);
					} else {
						ModalMsg.chromeLogger("您已经评分过了，不能再次评分")
					}
				}

				//获取单个资源的详细信息/评论
				$scope.VM.listInfoCom = function(id, fromFlag) {
					$scope.VM.resourceId = id;
					$scope.VM.fromFlag = fromFlag;
					Preview.listInfo({
						resId: id,
						fromFlag: fromFlag
					}, function(data) {
						$scope.VM.load = false;
						$scope.VM.info = data.data;
						_.each($scope.showStar, function(v, i) {
							$scope.curStar[i] = false;
							$scope.hoverStar[i] = false;
						});

						for (var i = 0; i < $scope.VM.info.score; i++) {
							//几颗星亮
							$scope.curStar[i] = true;
						}

						// 第一个资源
						var tmpList = {
							"thumbnailpath": $scope.VM.info.fpath,
							"fromFlag": $scope.VM.info.fromflag?$scope.VM.info.fromflag:$scope.VM.fromFlag,
							"id": $scope.VM.resourceId,
							"title": $scope.VM.info.title,
							"fileExt": $scope.VM.info.fileExt
						}

						var isRes = false;
						// 判断 资源是否在当前列表中，不在加入第一个，在忽略
						_.each($scope.VM.allSourceList, function(v, i) {
							if (tmpList.id == v.id) {
								isRes = true;
							}
						})

						if (!isRes) {
							$scope.VM.allSourceList.splice(0, 0, tmpList);
							// 给导航 赋值
							$scope.VM.fromFlag = $scope.VM.allSourceList[0].fromFlag;
							$scope.VM.resName = $scope.VM.allSourceList[0].title;
						}
					});

					//获取对应评论
					getComment(id);
				}
				
				//获取资源信息 评论
				$scope.VM.listInfoCom($scope.VM.resourceId, $scope.VM.fromFlag);

				//获取所有评论
				$scope.userName = $localStorage.authUser.userName;
				$scope.contentShow = [];

				function getComment(id) {
					Preview.myComment({
						resId: id,
						fromFlag: $scope.VM.fromFlag,
					}, function(data) {

						if (data.code == "OK") {
							$scope.myCommentList = data.data;

							_.each($scope.myCommentList, function(v, i) {
								$scope.contentShow[i] = true;

							});
						}

					});
					//获取其他人的评论
					Preview.otherComment({
						resId: id,
						fromFlag: $scope.VM.fromFlag,
					}, function(data) {
						if (data.code == "OK") {
							$scope.otherCommentList = data.data;
						}
					});

				}

				//评论限制操作
				$scope.commentNum = 200;
				$scope.VM.inputComment = "";
				$scope.changeComment = function() {
					if ($scope.VM.inputComment.length <= 200)
						$scope.commentNum = 200 - $scope.VM.inputComment.length;
					else
						$scope.commentNum = $scope.VM.inputComment.length;
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
							ModalMsg.chromeLogger("评完分才能评论哦！");
							return false;
						}
						if ($scope.VM.inputComment.length == 0) {
							ModalMsg.chromeLogger("评论内容不能为空！");
							return false;
						}
						if ($scope.VM.inputComment.length > 200) {
							ModalMsg.chromeLogger("评论内容不能超过个200个字符！");
							return false;
						}
						Preview.editComment({
							resId: $scope.VM.resourceId,
							displayContent: $scope.VM.inputComment,
							fromFlag: $scope.VM.fromFlag,
							ascore: score,
							isScore: 1
						}, function(data) {
							if (data.code == "OK") {
								getComment($scope.VM.resourceId); //获取我的评论
								$scope.VM.inputComment = "";
								$scope.commentNum = 200;
								ModalMsg.chromeLogger("评论成功！");
							}
						});
					}
					//发布评分
				function publishScore(index) {
					Preview.editComment({
						resId: $scope.VM.resourceId,
						displayContent: " ",
						fromFlag: $scope.VM.fromFlag,
						ascore: index,
						isScore: 0
					}, function(data) {
						if (data.code == "OK") {

							for (var i = 0; i < index; i++) {
								$scope.curStar[i] = true;
							}
							$scope.VM.info.userNum++;
							$scope.VM.info.avgScore = index;

							ModalMsg.chromeLogger("评分成功！");

						}
					});
				}

				//删除评论
				$scope.deleteCom = function(id, index) {
						Preview.editComment({
							commentId: id,
							_method: "DELETE"
						}, function(data) {
							if (data.code == "OK") {
								$scope.myCommentList.splice(index, 1);
							}
						});

					}
					//编辑评论
				$scope.editCom = function(id, index) {
					$scope.VM.preEdit = $scope.myCommentList[index].acontent;
					_.each($scope.contentShow, function(v, i) {
						$scope.contentShow[i] = true;
					});
					$scope.contentShow[index] = false;
					$scope.editSure = function(index) {
							if ($scope.myCommentList[index].acontent.length > 200) {
								ModalMsg.chromeLogger("评论不能字数不能超过200！");
								return false;
							}
							if ($scope.myCommentList[index].acontent.length == 0) {
								ModalMsg.chromeLogger("评论不能为空！");
								return false;
							}
							Preview.editComment({
								displayContent: $scope.myCommentList[index].acontent,
								commentId: id,
								_method: "PATCH"
							}, function(data) {
								if (data.code == "OK") {
									_.each($scope.contentShow, function(v, i) {
										$scope.contentShow[i] = true;
									});

								}

							});
						}
						//取消
					$scope.offModal = function($index) {
						_.each($scope.contentShow, function(v, i) {
							$scope.contentShow[i] = true;
						});
						$scope.myCommentList[index].acontent = $scope.VM.preEdit;

					}
				}

			}
		])
}());