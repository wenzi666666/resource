/**
 * Angular module for frontend.examples.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
	'use strict';

	// Define frontend.public module

	ApplicationConfiguration.registerModule('webApp.coms.systemres');
	// Module configuration
	angular.module('webApp.coms.systemres')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('systemres', {
						url: '/systemres',
						views: {
							'content@': {
								templateUrl: '/coms/system-res/views/systemres.html',
								controller: 'SystemResController'
							},
							'header@': {
								templateUrl: '/coms/layout/header/header.html',
								controller: 'LayoutntController'
							},
							'footer@': {
								templateUrl: '/coms/layout/footer/footer.html'
							}
						}
					})
			}
		])
		.factory('SystemRes', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("SystemResController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				
				$(function(){
	//单击更多展开
	$(".line2 .span-3 a").click(function(){
		$(".line2 .span-22").slideToggle(1000);
		if($(".line2 .span-3 a").text()=='更多'){
			$(".line2 .span-3 a").text('收起');
			$(".line2 .span-3 img").addClass('img-transform');
		}else{
			$(".line2 .span-3 a").text('更多')
			$(".line2 .span-3 img").removeClass('img-transform');
		}
	})
	$(".line4 .span-3 a").click(function(){
		$(".line4 .span-22").slideToggle(1000);
		if($(".line4 .span-3 a").text()=='更多'){
			$(".line4 .span-3 a").text('收起');
			$(".line4 .span-3 img").addClass('img-transform');
		}else{
			$(".line4 .span-3 a").text('更多')
			$(".line4 .span-3 img").removeClass('img-transform');
		}
	})
	//在学段点击选中当前
	// $(".line1 .span-2 a").click(function(){
	// 	$(".line1 .span-2 a").removeClass('orange-style-current')
	// 	$(this).addClass('orange-style-current');
	// 	alert($(this).text());
	// })
	// $(".line2 .span-21 a,.line2 .span-22 a").click(function(){
	// 	$(".line2 .span-21 a,.line2 .span-22 a").removeClass('orange-style-current')
	// 	$(this).addClass('orange-style-current');
	// })
	$(".line3 .span-2 a").click(function(){
		$(".line3 .span-2 a").removeClass('orange-style-current')
		$(this).addClass('orange-style-current')
		$(".a-version").text($(this).text());
	})
	var line4 = $(".line4 .span-21 a,.line4 .span-22 a")
	line4.click(function(){
		line4.removeClass('orange-style-current');
		$(this).addClass('orange-style-current');
		$(".a-version2").text($(this).text());
	})
	//收起筛选
	$(".right-label").click(function(){
		$(".base-rbody").slideToggle(1000);
		var shvalue = $(".right-label").text();
        if(shvalue == '展开筛选'){
        	$(".right-label").text('收起筛选');
        }else{
        	$(".right-label").text('展开筛选');
        }
	})
    //课标导航右侧TAB
	$(".base-rright-title div").click(function(i){
		$(".base-rright-title div").removeClass("current-base");
		$(this).addClass("current-base");
		var index = $(".base-rright-title div").index(this);
		$(".base-rright-body .base-r-hide").removeClass("base-r-show");
		$(".base-rright-body .base-r-hide").eq(index).addClass("base-r-show");
	})


	$(".base-r-top p a").click(function(){
		$(".base-r-top p a").removeClass("base-co");
		$(this).addClass("base-co");
	})

	//span1下单击button按钮事件
    var $input = $(".base-ul li input[type='checkbox']");
    $input.each(function(i){
    	$input.eq(i).click(function(){
    		if($(this).is(':checked')){
	            $(this).parent().parent().addClass('checked-style')
	    	}else{
	    		$(this).parent().parent().removeClass('checked-style')
	    	}
    	})
    	
    })

    //鼠标移入时显示三个小图标
    $(".base-ul .span4").each(function(i){
    	$(".base-ul .span4").eq(i).hover(function(){
    		var img1 = '<img class="img1" src="img/base-1.png">';
		    var img2 = '<img class="img2" src="img/c2.png">';
			$(this).append(img1,img2);
			$(".img1").click(function(){
				$(".img1").attr("src","img/base-11.png");
	     		$(".img2").attr("src","img/c2.png");	
			})
			$(".img2").click(function(){
				$(".img1").attr("src","img/base-1.png");
				$(".img2").attr("src","img/cc2.png");
			})
    	},function(){
    		var img1 = '<img src="img/base-1.png">';
		    var img2 = '<img src="img/c2.png">';
			$(this).empty(img1,img2);
    	})
    })

    //两种不同模式的显示
    $('.t1').click(function(){
    	$('.t1').attr('src','img/tab1.png');
    	$('.t2').attr('src','img/tab2.png');
    	$('.base-r-main').css('display','block');
    	$('.base-r-main-s').css('display','none');
    })
     $('.t2').click(function(){
     	$('.t1').attr('src','img/tab11.png');
    	$('.t2').attr('src','img/tab22.png');
    	$('.base-r-main').css('display','none');
    	$('.base-r-main-s').css('display','block');
    })
     	//span1下单击button按钮事件
    var $input = $(".base-ul li input[type='checkbox']");
    $input.each(function(i){
    	$input.eq(i).click(function(){
    		if($(this).is(':checked')){
	            $(this).parent().parent().addClass('checked-style')
	    	}else{
	    		$(this).parent().parent().removeClass('checked-style')
	    	}
    	})
    	
    })
     //缩略图下单击下载和星号
     $(".base1").click(function(){
     	$(this).attr("src","img/base-11.png");
     	$(this).parent().parent().parent().addClass('li-s-checked');
     })


     //select选择事件学段
     var selectedValue1= $(".base-select1").find("option:selected").text();
     $(".line1 .span-2 a").each(function(i){
       	  var eachValue1 = $(".line1 .span-2 a").eq(i).text();
       	  if(selectedValue1 == eachValue1){
       	  	$(this).addClass('orange-style-current');
       	  }
       })
     $(".base-select1").bind("change",function(){
       var selectValue1 = $(this).val(); 
       $(".line1 .span-2 a").each(function(i){
       	  var eachValue1 = $(".line1 .span-2 a").eq(i).text();
       	  if(selectValue1 == eachValue1){
       	  	$(".line1 .span-2 a").removeClass("orange-style-current");
       	  	$(this).addClass('orange-style-current');
       	  }
       })
     })
     //select选择事件学科
    var selectedValue2 = $(".base-select2").find("option:selected").text();
    $(".line2 .span-21 a,.line2 .span-22 a").each(function(i){
    	var eachValue2 = $(".line2 .span-21 a,.line2 .span-22 a").eq(i).text();
    	if(selectedValue2 == eachValue2){
    		$(this).addClass('orange-style-current');
    	}
    })
    $(".base-select2").bind("change",function(){
    	var selectValue2 = $(this).val();
    	 $(".line2 .span-21 a,.line2 .span-22 a").each(function(i){
    	var eachValue2 = $(".line2 .span-21 a,.line2 .span-22 a").eq(i).text();
    	if(selectValue2 == eachValue2){
    		$(".line2 .span-21 a,.line2 .span-2 a").removeClass("orange-style-current");
    		$(this).addClass('orange-style-current');
    	}
    })
    })

})
			}
		])
}());