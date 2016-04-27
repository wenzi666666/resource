/**
 * Generic models angular module initialize.
 */
(function() {
	'use strict';
	angular.module('webApp.core.directives', [])
		// 图片回滚
		.directive('fallbackSrc', function() {
			var fallbackSrc = {
				link: function postLink(scope, iElement, iAttrs) {
					iElement.bind('error', function() {
						var src = iAttrs.fallbackSrc;
						var format = '.' + src.split('.')[src.split('.').length-1];
						var fallbacksrc = "assets/img/sample.png";
						console.log(src)
						//备课夹默认图片
						if(src == "prepare") {
							angular.element(this).attr("src", "assets/img/prepare_default.png");
						}else if(src == "personalcenter") {
							angular.element(this).attr("src", "assets/img/person/head/Icon12.jpg");
						}else {
							//是否包含中文正则
//							var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
//							console.log(window.allFormats, format)
							if(_.indexOf(window.allFormats, format) > -1 ){
							  	angular.element(this).attr("src", window.IconServer+src+".png");
							}else{
								angular.element(this).attr("src", fallbacksrc);
							}
						}
					});
				}
			}
			return fallbackSrc;
		})

		// 日期转换
		.directive('showTime', ['$filter', function($filter) {
			//这是打开锁定日历控件后用于显示锁定时间，包括日期的directive
			return {
				restrict: 'E',
				template: '<span>{{styleselect[0]}}<span class="text-warning">{{styleselect[1]}}</span></span>',
				replace: true,
				link: function(scope, ele, attrs) {
					attrs.$observe('value', function(param) {
						function toDateTime(dateStr) {
							return Date.parse(dateStr.replace(/-/gi, "/"));
						}
						if (!param) return; //参数为空直接返回
						scope.styleselect = [];
						var type = (param.split(",")[1] == 'createTopicTime'); //展示时间的类型，showTopicTime为主题列表时间显示，createTopicTime为发表主题时间显示
						param = param.split(",")[0]; //需转换的时间
						var updateDate = new Date(toDateTime(param)); //更新时间的日期
						if (updateDate == 'Invalid Date') {
							scope.styleselect[0] = param;
							return;
						} //若时间是一个无效日期，直接返回参数
						var currentDate = new Date();
						var days = ['日', '一', '二', '三', '四', '五', '六'];
						var updateTimeTimestamp = updateDate.getTime(); //更新时间的时间戳
						if (!type) { //主题列表时间显示
							var nextDayDate = new Date(toDateTime(param)); //更新时间第二天的日期
							nextDayDate.setDate(nextDayDate.getDate() + 1);
							var remainingDays = !!updateDate.getDay() ? (7 - updateDate.getDay()) : 0; //一周剩余天数
							var difftime1 = parseInt((new Date(toDateTime($filter('date')(nextDayDate, "yyyy-MM-dd 00:00:00"))) - updateDate) / 1000); //更新时间跟第二天零点的时间差，单位：秒
							var difftime2 = parseInt((currentDate.getTime() - updateTimeTimestamp) / 1000); //获得两个时间的时间差（秒），当前时间-最新更新时间
						} else { //发表主题时间显示
							var nextDayDate = new Date(toDateTime($filter('date')(currentDate, "yyyy-MM-dd HH:mm:ss"))); //当前时间第二天的日期
							nextDayDate.setDate(nextDayDate.getDate() + 1);
							var remainingDays = !!currentDate.getDay() ? (7 - currentDate.getDay()) : 0; //一周剩余天数
							var difftime1 = parseInt((new Date(toDateTime($filter('date')(nextDayDate, "yyyy-MM-dd 00:00:00"))) - currentDate) / 1000); //当前时间跟第二天零点的时间差，单位：秒
							var difftime2 = parseInt((updateTimeTimestamp - currentDate.getTime()) / 1000); //获得两个时间的时间差（秒），最新更新时间-当前时间
						}
						//时间的判断
						if (difftime2 <= 1 && !type) {
							updateDate = "刚刚"
						} else if (difftime2 > 1 && difftime2 <= 59 && !type) {
							updateDate = difftime2 + "秒前";
						} else if (difftime2 / 60 >= 1 && difftime2 / 60 <= 59 && !type) {
							updateDate = parseInt(difftime2 / 60) + "分钟前";
						} else if (difftime2 < difftime1) {
							updateDate = "今天" + (!type ? "" : " ") + $filter('date')(updateDate, "HH:mm");
						} else if (difftime2 < (difftime1 + 3600 * 24)) {
							updateDate = (!type ? "昨天" : "明天 ") + $filter('date')(updateDate, "HH:mm");
						} else if (difftime2 < (difftime1 + 3600 * 24 * 2)) {
							updateDate = (!type ? "前天" : "后天 ") + $filter('date')(updateDate, "HH:mm");
						} else if (difftime2 < (difftime1 + 3600 * 24 * remainingDays)) {
							updateDate = "本周" + days[updateDate.getDay()] + (!type ? "" : " ") + $filter('date')(updateDate, "HH:mm");
						} else if (difftime2 < (difftime1 + 3600 * 24 * (7 + remainingDays))) {
							updateDate = (!type ? "上周" : "下周") + days[updateDate.getDay()] + (!type ? "" : " ") + $filter('date')(updateDate, "HH:mm");
						} else if (updateDate.getFullYear() == currentDate.getFullYear()) {
							updateDate = $filter('date')(updateDate, "MM-dd HH:mm");
						} else {
							updateDate = $filter('date')(updateDate, "yyyy-MM-dd HH:mm");
						}
						scope.mydate = updateDate;
						if (!type) {
							scope.styleselect[0] = scope.mydate;
							scope.styleselect[1] = "";
						} else {
							if (scope.mydate.split(" ")[0].length <= 3) {
								scope.styleselect[0] = scope.mydate.split(" ")[0] + " ";
								scope.styleselect[1] = scope.mydate.split(" ")[1];
							} else {
								scope.styleselect[0] = "";
								scope.styleselect[1] = scope.mydate;
							}
						}
					})
				}
			}
		}]).directive('showDate', ['$filter', function($filter) {
			//这是打开锁定日历控件显示锁定日期的directive
			return {
				restrict: 'E',
				template: '<span>{{styleSelectDate[0]}}{{styleSelectDate[1]}}</span>',
				replace: true,
				link: function(scope, ele, attrs) {
					attrs.$observe('value', function(param) {
						function toDateTime(dateStr) {
							return Date.parse(dateStr.replace(/-/gi, "/"));
						}
						if (!param) return; //参数为空直接返回
						scope.styleSelectDate = [];
						var type = (param.split(",")[1] == 'createTopicTime'); //展示时间的类型，showTopicTime为主题列表时间显示，createTopicTime为发表主题时间显示
						param = param.split(",")[0]; //需转换的时间
						var updateDate = new Date(toDateTime(param)); //更新时间的日期
						if (updateDate == 'Invalid Date') {
							scope.styleSelectDate[0] = param;
							return;
						} //若时间是一个无效日期，直接返回参数
						var currentDate = new Date();
						var days = ['日', '一', '二', '三', '四', '五', '六'];
						var updateTimeTimestamp = updateDate.getTime(); //更新时间的时间戳
						if (!type) { //主题列表时间显示
							var nextDayDate = new Date(toDateTime(param)); //更新时间第二天的日期
							nextDayDate.setDate(nextDayDate.getDate() + 1);
							var remainingDays = !!updateDate.getDay() ? (7 - updateDate.getDay()) : 0; //一周剩余天数
							var difftime1 = parseInt((new Date(toDateTime($filter('date')(nextDayDate, "yyyy-MM-dd "))) - updateDate) / 1000); //更新时间跟第二天零点的时间差，单位：秒
							var difftime2 = parseInt((currentDate.getTime() - updateTimeTimestamp) / 1000); //获得两个时间的时间差（秒），当前时间-最新更新时间
						} else { //发表主题时间显示
							var nextDayDate = new Date(toDateTime($filter('date')(currentDate, "yyyy-MM-dd"))); //当前时间第二天的日期
							nextDayDate.setDate(nextDayDate.getDate() + 1);
							var remainingDays = !!currentDate.getDay() ? (7 - currentDate.getDay()) : 0; //一周剩余天数
							var difftime1 = parseInt((new Date(toDateTime($filter('date')(nextDayDate, "yyyy-MM-dd"))) - currentDate) / 1000); //当前时间跟第二天零点的时间差，单位：秒
							var difftime2 = parseInt((updateTimeTimestamp - currentDate.getTime()) / 1000); //获得两个时间的时间差（秒），最新更新时间-当前时间
						}
						//时间的判断
						if (difftime2 <= 1 && !type) {
							updateDate = "刚刚"
						} else if (difftime2 < difftime1) {
							updateDate = "今天" + (!type ? "" : " ");
						} else if (difftime2 < (difftime1 + 3600 * 24)) {
							updateDate = (!type ? "昨天" : "明天 ");
						} else if (difftime2 < (difftime1 + 3600 * 24 * 2)) {
							updateDate = (!type ? "前天" : "后天 ");
						} else if (difftime2 < (difftime1 + 3600 * 24 * remainingDays)) {
							updateDate = "本周" + days[updateDate.getDay()] + (!type ? "" : " ");
						} else if (difftime2 < (difftime1 + 3600 * 24 * (7 + remainingDays))) {
							updateDate = (!type ? "上周" : "下周") + days[updateDate.getDay()] + (!type ? "" : " ");
						} else if (updateDate.getFullYear() == currentDate.getFullYear()) {
							updateDate = $filter('date')(updateDate, "MM-dd");
						} else {
							updateDate = $filter('date')(updateDate, "yyyy-MM-dd");
						}
						scope.mydate = updateDate;
						if (!type) {
							scope.styleSelectDate[0] = scope.mydate;
							scope.styleSelectDate[1] = "";
						} else {
							if (scope.mydate.split(" ")[0].length <= 3) {
								scope.styleSelectDate[0] = scope.mydate.split(" ")[0] + " ";
								scope.styleSelectDate[1] = scope.mydate.split(" ")[1];
							} else {
								scope.styleSelectDate[0] = "";
								scope.styleSelectDate[1] = scope.mydate;
								//console.log(scope.styleSelectDate[0], scope.styleSelectDate[1])
							}
						}
					})
				}
			}
		}])
		// anguar编译html
		.directive('compile', ['$compile', function($compile) {
			return function(scope, element, attrs) {
				scope.$watch(
					function(scope) {
						// watch the 'compile' expression for changes
						return scope.$eval(attrs.compile);
					},
					function(value) {
						// when the 'compile' expression changes
						// assign it into the current DOM
						element.html(value);

						// compile the new DOM and link it to the current
						// scope.
						// NOTE: we only compile .childNodes so that
						// we don't get into infinite loop compiling ourselves
						$compile(element.contents())(scope);
					}
				);
			};
		}]).directive('toolClass', ['toolCalss', function() {
			return {
				restrict: 'E',
				link: function(scope, element, attr) {
					element.on('click', function() {
						element.addClass=(attr.value);
					});
				}
			}
		}])
		.directive('resSize', function() {
			return {
				restrict: 'E',
				transclude: true,
				template: '<span class="item-info-size">大小：{{resSize}}M</span>',
				replace: true,
				link: function($scope, ele, attrs) {
					attrs.$observe('value', function(param) {
						var flo = parseFloat(param);
						if(isNaN(flo)) $scope.resSize = 0;
						else $scope.resSize = Math.round(param/1024/1024*10)/10;
					})
				}
			}
		})
		.directive('resSizet', function() {
			return {
				restrict: 'E',
				transclude: true,
				template: '<span class="item-info-size">{{resSize}}M</span>',
				replace: true,
				link: function($scope, ele, attrs) {
					attrs.$observe('value', function(param) {
						var flo = parseFloat(param);
						if(isNaN(flo)) $scope.resSize = 0;
						else $scope.resSize = Math.round(param/1024/1024*10)/10;
					})
				}
			}
		})
		// 显示星星评分
		.directive('resStar', function() {
			return {
				restrict: 'E',
				transclude: true,
				template: '<label class="res-star"><i class="icon-star" ng-repeat="v in starData track by $index" ' + "ng-class=\"{'star-active':isStar[$index]}\"" +'></i></label>',
				replace: true,
				link: function($scope, ele, attrs) {
					$scope.starData = [1,2,3,4,5];
					$scope.isStar = [false,false,false,false,false];
					attrs.$observe('value', function(param) {
						var value = Math.round(param);
						
						_.each($scope.starData, function(v,i) {
							if(i < value){
								$scope.isStar[i] = true;
							}else{
								$scope.isStar[i] = false;
							}
						})
					})
				}
			}
		})
		//资源操作icon样式悬停变化
		.directive('activeSrc', function() {
			var activeSrc = {
				link: function postLink(scope, iElement, iAttrs) {
					iElement.bind('mouseover', function() {
						var src = iAttrs.activeSrc;
						angular.element(this).attr("src", src);
					});
				}
			}
			return activeSrc;			
		})

		.directive('defaultSrc', function() {
			var defaultSrc = {
				link: function postLink(scope, iElement, iAttrs) {
					iElement.bind('mouseout', function() {
						var src = iAttrs.defaultSrc;
						angular.element(this).attr("src", src);
					});
				}
			}
			return defaultSrc;			
		})
		.directive('opBtn', function() {
			return {
				restrict: 'A',
				transclude: true,
				replace: true,
				link: function($scope, ele, attrs) {
					//console.log(ele);
					ele[0].innerHTML = attrs.opBtn;
					//console.log(attrs);
					var opbtns = $(".op-btn-group button");
					ele.on('click', function() {
						opbtns.addClass("btn-white");
						ele.removeClass('btn-white');
					})
				}
			}
		})

	.directive('contenteditable', function() {
			//设置div的数据绑定
			return {
				restrict: 'A', // only activate on element attribute
				require: '?ngModel', // get a hold of NgModelController
				link: function(scope, element, attrs, ngModel) {
					if (!ngModel) return; // do nothing if no ng-model

					// Specify how UI should be updated
					ngModel.$render = function() {
						element.html(ngModel.$viewValue || '');
					};

					// Listen for change events to enable binding
					element.on('blur keyup change', function() {
						scope.$apply(readViewText);
					});

					// No need to initialize, AngularJS will initialize the text based on ng-model attribute

					// Write data to the model
					function readViewText() {
						var html = element.html();
						// When we clear the content editable the browser leaves a <br> behind
						// If strip-br attribute is provided then we strip this out
						if (attrs.stripBr && html == '<br>') {
							html = '';
						}
						ngModel.$setViewValue(html);
					}
				}
			};
		})
		.directive('addToCartButton', function() {
			function link(scope, element, attributes) {
				element.on('click', function(event) {
					var cartElem = angular.element(document.getElementsByClassName("shopping-cart"));
					//console.log(cartElem);
					var offsetTopCart = cartElem.prop('offsetTop');
					var offsetLeftCart = cartElem.prop('offsetLeft');
					
					var imgElem = angular.element(event.target.parentNode.parentNode.childNodes[1]);
					var parentElem = angular.element(event.target.parentNode.parentNode);
					
					var offsetLeft = imgElem.prop("offsetLeft");
					var offsetTop = imgElem.prop("offsetTop");
					//console.log(offsetLeftCart + ' ' + offsetTopCart);
					//console.log(offsetLeft + ' ' + offsetTop + ' ' + imgElem);
					var imgClone = angular.element('<label style="font-size:28px;color:red;width:40px;height:40px"><i class="icon-plus"></i>1</label>');
					imgClone.css({
						'height': '150px',
						'position': 'absolute',
						'top': offsetTop + 'px',
						'left': offsetLeft + 'px',
						'opacity': 0.5
					});
					imgClone.addClass('itemaddedanimate');
					parentElem.append(imgClone);
					setTimeout(function() {
						imgClone.css({
							'height': '75px',
							'top': "-" + offsetTopCart+ 'px',
							'left': offsetLeft + 50 + 'px',
							'opacity': 0.5
						});
					}, 600);
					setTimeout(function() {
						imgClone.css({
							'height': 0,
							'opacity': 0.5

						});
						cartElem.addClass('shakeit');
					}, 1000);
					setTimeout(function() {
						cartElem.removeClass('shakeit');
						imgClone.remove();
					}, 1500);
				});
			};


			return {
				restrict: 'E',
				link: link,
				transclude: true,
				replace: true,
				scope: {},
				template: '<button class="add-to-cart" ng-transclude></button>'
			};
		});
}());