/**
 * 系统资源 模块
 */
(function() {
	'use strict';
	// Module configuration
	angular.module('webApp.coms.previewres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('previewres', {
						url: '/previewres/:resId/:curTfcode',
						views: {
							'content@': {
								templateUrl: '/coms/res-preview/views/previewres.html',
								controller: 'PreviewResController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header2.html',
								controller: 'LayoutController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('Preview', ['$resource',
			function($resource) {
				return $resource('', {}, {
					// 获取资源的所有版本目录
					lists: {
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/preview/lists  "
					},
					listInfo: { //获取单个资源的详细信息
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/resPreviewInfo"
					},
					myComment: { //查询自己评论
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/myComments"
					},
					editComment: { ////删除，修改 新建评论
						method: "POST",
						url: BackendUrl + "/resRestAPI/v1.0/myComments"
					},

					otherComment: { //查询他人评论
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/otherComments"
					},
					systemSource: { //获取系统资源接口
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/sysResource"
					},
					districtSource: { //获取区本/校本接口
						method: "GET",
						url: BackendUrl + "/resRestAPI/v1.0/districtResource"
					}

				})
			}
		])
		.controller("PreviewResController", ['$scope', '$stateParams', '$state', '$location', 'Preview', '$localStorage',
			function($scope, $stateParams, $state, $location, Preview, $localStorage) {
				// 筛选 主controller 
				// 变量共享
				$scope.VM = {};

				console.log($stateParams)

				// 资源nav数据
				Preview.lists({
					resId: $stateParams.resId,
					curTfcode: $stateParams.curTfcode,
					fromFlag: $localStorage.fromFlag

				}, function(data) {
					console.log(data.data)
					$scope.navList = data.data;
					$scope.currentNav = $scope.navList[0];
					console.log($stateParams.resId, $stateParams.curTfcode, $localStorage.fromFlag);

				});
				$scope.VM.curNav = [];
				$scope.VM.curNav[0] = true;

				//切换目录
				$scope.selectNav = function(index) {
					//选中
					_.each($scope.navList, function(v, i) {
						$scope.VM.curNav[i] = false;

					});
					$scope.VM.curNav[index] = true;
					$scope.currentNav = $scope.navList[index];

				}

				//获取单个资源的详细信息
				Preview.listInfo({
					resId: $stateParams.resId,
					fromFlag: $localStorage.fromFlag

				}, function(data) {
					$scope.info = data.data;
					$scope.starNum = []; //星星数量
					for (var i = 0; i < $scope.info.avgScore; i++) {
						$scope.starNum.push(i);
					}

					console.log(data)
				});

				//获取所有资源
				if ($localStorage.fromFlag == "0") {
					//系统
					Preview.systemSource({
						poolId: 0,
						mTypeId: 0,
						fileFormat: "全部",
						orderBy: 0,
						tfCode: $stateParams.curTfcode,
						page: 1,
						perPage: 20
					}, function(data) {
						console.log(data)
					});
				} else {
					//区本或者校本
					Preview.districtSource({
						mTypeId: 0,
						fileFormat: "全部",
						orderBy: 0,
						tfCode: $stateParams.curTfcode,
						page: 1,
						perPage: 20,
						fromFlag: $localStorage.fromFlag

					}, function(data) {
						console.log(data);
					});
				}

				// 假数据
				$scope.slides = [{
					title: "荷塘月色-课件1",
					type: 'img',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-图片",
					type: 'pdf',
					src: "http://chat.tfedu.net/res/fe-tiku.pdf"
				}, {
					title: "荷塘月色-pdf",
					type: 'media',
					src: "http://m.tfedu.net/book/ereader/"
				}, {
					title: "荷塘月色-案例",
					type: 'html',
					src: "http://101.200.190.27:8099/down/dec/00ae9e79-a560-4e23-bf01-609c711666ec-274/index.htm"
				}]

				//上一个
				var currentSlideIndex = 3;
				$scope.slidePre = function() {
						if (currentSlideIndex > 0) {
							$scope.selectRes(currentSlideIndex - 1);
						} else {
							currentSlideIndex = $scope.slides.length - 1;
						}
					}
					//下一个
				$scope.slideNext = function() {
					if (currentSlideIndex < $scope.slides.length - 1) {
						$scope.selectRes(currentSlideIndex + 1);
					} else {
						currentSlideIndex = 0;
					}
				}

				//跳转到
				$scope.selectRes = function(index) {
					var tpl = '';
					currentSlideIndex = index;
					switch ($scope.slides[index].type) {
						//					case "img1":
						//					  tpl = "<img src='" +$scope.slides[index].src + "' />"
						//					  $('#res-slide-content').html(tpl);
						//					  break;
						default: tpl = "<iframe width='100%' height='700px' src='" + $scope.slides[index].src + "' style='border:0'></iframe>"
						$('#res-slide-content').html(tpl);
					}
				}

				$scope.selectRes(0);

				//评论
				$scope.commentNum = 200;
				$scope.inputComment = "";
				$scope.changeComment = function() {
					if ($scope.inputComment.length < 200) {
						$scope.commentNum = 200 - $scope.inputComment.length;
					} else {

					}
				}
				
				$scope.myShow=true;
				$scope.otherShow=false;
				$scope.changeBlock=function(obj){
					if(obj=="my")
					{
						$scope.myShow=true;
						$scope.otherShow=false;
						
					}else{
						$scope.myShow=false;
						$scope.otherShow=true;
					}
				}

				//获取我的评论
				$scope.userName = $localStorage.authUser.userName;

				var getComment = function() {
					Preview.myComment({
						resId: $stateParams.resId,
						fromFlag: $localStorage.fromFlag,
					}, function(data) {
						console.log(data)
						$scope.myCommentList = data.data;
					});
				}
				getComment(); //获取我的评论
				//获取其他人的评论
					Preview.otherComment({
						resId: $stateParams.resId,
						fromFlag: $localStorage.fromFlag,
					}, function(data) {
						$scope.otherCommentList = data.data;
						
				});
				
				
				//发布评论
				$scope.publishComment = function() {
					Preview.editComment({
						resId: $stateParams.resId,
						displayContent: $scope.inputComment,
						fromFlag: $localStorage.fromFlag,
						ascore: 3,
						isScore: 1
					}, function(data) {
						getComment(); //获取我的评论
						$scope.inputComment="";
					});
				}
				
				
				
				
				$scope.commentTime=function(atime){
					  var now=new Date(atime);
					  
					  var   year=now.getFullYear();     
		              var   month=now.getMonth()+1;     
		              var   date=now.getDate();     
		              var   hour=now.getHours();     
		              var   minute=now.getMinutes();     
		              var   second=now.getSeconds();     
		              return   year+"."+month+"."+date+"   "+hour+":"+minute+":"+second;      
				}
				

			}
		])
}());