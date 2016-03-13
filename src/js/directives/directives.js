/**
 * Generic models angular module initialize.
 */
(function() {
	'use strict';
	angular.module('webApp.core.directives', [])
		.directive('fallbackSrc', function() {
			var fallbackSrc = {
				link: function postLink(scope, iElement, iAttrs) {
					iElement.bind('error', function() {
						var src = iAttrs.fallbackSrc;
						if (src == "")
							src = window.fallbacksrc
						angular.element(this).attr("src", src);
					});
				}
			}
			return fallbackSrc;
		}).directive('scrollToItem', function() {
			return {
				restrict: 'A',
				link: function(scope, $elm, attr) {
					$elm.on('click', function() {
						$(attr.value).animate({
							scrollTop: 0
						}, "slow");
					});
				}
			}
		}).directive('showTime', ['$filter', function($filter) {
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
								console.log(scope.styleSelectDate[0], scope.styleSelectDate[1])
							}
						}
					})
				}
			}
		}]).directive('openDate', ['$filter', function($filter) {
			//这是打开锁定日历控件显示定时发表时间的directive
			return {
				restrict: 'E',
				template: '<span>{{styleSelectOpenDate[0]}}{{styleSelectOpenDate[1]}}</span>',
				replace: true,
				link: function(scope, ele, attrs) {
					attrs.$observe('value', function(param) {
						function toDateTime(dateStr) {
							return Date.parse(dateStr.replace(/-/gi, "/"));
						}
						if (!param) return; //参数为空直接返回
						scope.styleSelectOpenDate = [];
						var type = (param.split(",")[1] == 'createTopicTime'); //展示时间的类型，showTopicTime为主题列表时间显示，createTopicTime为发表主题时间显示
						param = param.split(",")[0]; //需转换的时间
						var updateDate = new Date(toDateTime(param)); //更新时间的日期
						if (updateDate == 'Invalid Date') {
							scope.styleSelectOpenDate[0] = param;
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
							scope.styleSelectOpenDate[0] = scope.mydate;
							scope.styleSelectOpenDate[1] = "";
						} else {
							if (scope.mydate.split(" ")[0].length <= 3) {
								scope.styleSelectOpenDate[0] = scope.mydate.split(" ")[0] + " ";
								scope.styleSelectOpenDate[1] = scope.mydate.split(" ")[1];
							} else {
								scope.styleSelectOpenDate[0] = "";
								scope.styleSelectOpenDate[1] = scope.mydate;
								console.log(scope.styleSelectOpenDate[0], scope.styleSelectOpenDate[1])
							}
						}
					})
				}
			}
		}]).directive('compile', ['$compile', function($compile) {
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
		}])

	// .directive('ngLightbox', ['$compile', function($compile) {
	//     //这是查看大图的指令
	//     return function(scope, element, attr) {
	//         var lightbox, options, overlay;

	//         var defaults = {
	//             'class_name': false,
	//             'trigger': 'manual',
	//             'element': element[0],
	//             'kind': 'normal'
	//         }


	//         var options = angular.extend(defaults, angular.fromJson(attr.ngLightbox));


	//         // check if element is passed by the user
	//         options.element = typeof options.element === 'string' ? document.getElementById(options.element) : options.element;

	//         var add_overlay = function(){
	//             if(document.getElementById('overlay')) return;
	//             // compiling when we add it to have the close directive kick in
	//             overlay = $compile('<div id="overlay" ng-lightbox-close/>')(scope);

	//             // add a custom class if specified
	//             options.class_name && overlay.addClass(options.class_name);

	//             // append to dom
	//             angular.element(document.body).append(overlay);

	//             // load iframe options if defined
	//             options.kind === 'iframe' && load_iframe();

	//             // we need to flush the styles before applying a class for animations
	//             window.getComputedStyle(overlay[0]).opacity;
	//             overlay.addClass('overlay-active');
	//             angular.element(options.element).addClass('lightbox-active');
	//         }

	//         var load_iframe = function(){
	//             options.element = options.element || 'lightbox-iframe';
	//             var iframe = "<div id='" + options.element + "' class='lightbox'><iframe frameBorder=0 width='100%' height='100%' src='" + attr.href + "'></iframe></div>";
	//             angular.element(document.body).append(iframe)
	//         }

	//         if(options.trigger === 'auto'){
	//             add_overlay();
	//         }else{
	//             element.bind('click', function(event) {
	//                 add_overlay();
	//                 event.preventDefault();
	//                 return false;
	//             });
	//         }
	//     }
	// }]).directive('ngLightboxClose', function() {
	//     return function(scope, element, attr) {
	//         var transition_events = ['webkitTransitionEnd', 'mozTransitionEnd', 'msTransitionEnd', 'oTransitionEnd', 'transitionend'];

	//         angular.forEach(transition_events, function(ev){
	//             element.bind(ev, function(){
	//                 // on transitions, when the overlay doesnt have a class active, remove it
	//                 !angular.element(document.getElementById('overlay')).hasClass('overlay-active') && angular.element(document.getElementById('overlay')).remove();
	//             });
	//         });

	//         // binding esc key to close
	//         angular.element(document.body).bind('keydown', function(event){
	//             event.keyCode === 27 && remove_overlay();
	//         });

	//         // binding click on overlay to close
	//         element.bind('click', function(event) {
	//             remove_overlay();
	//         });
	//         // binding click on maganifying images
	//         angular.element(document.getElementsByClassName('lightbox')).bind('click', function(event) {
	//             remove_overlay();
	//         });

	//         var remove_overlay = function(){
	//             var overlay = document.getElementById('overlay');
	//             angular.element(document.getElementsByClassName('lightbox-active')[0]).removeClass('lightbox-active');

	//             // fallback for ie8 and lower to handle the overlay close without animations
	//             if(angular.element(document.documentElement).hasClass('lt-ie9')){
	//                 angular.element(overlay).remove();
	//             }else{
	//                 angular.element(overlay).removeClass('overlay-active');
	//             }
	//         }
	//     }
	// })

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
					console.log(cartElem);
					var offsetTopCart = cartElem.prop('offsetTop');
					var offsetLeftCart = cartElem.prop('offsetLeft');
					
					var imgElem = angular.element(event.target.parentNode.parentNode.childNodes[1]);
					var parentElem = angular.element(event.target.parentNode.parentNode);
					
					var offsetLeft = imgElem.prop("offsetLeft");
					var offsetTop = imgElem.prop("offsetTop");
					console.log(offsetLeftCart + ' ' + offsetTopCart);
					console.log(offsetLeft + ' ' + offsetTop + ' ' + imgElem);
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