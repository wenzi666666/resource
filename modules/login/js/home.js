var alen = texta.length;
function tabSlide(){
	var tablist = $("#userSelect li");
	var len = tablist.length;
	tablist.eq(0).addClass("userActive");
	tablist.each(function(i){
		tablist.eq(i).click(function(){
			console.log(i);
			tablist.eq(i).addClass("userActive");
			tablist.eq((i+1)%len).removeClass("userActive");
			tablist.eq((i-1)%len).removeClass("userActive");
		})
	})
}

$().ready(function(){ 
tabSlide();
var textroll = $(".rollBox a");
var rolli = 1;
textroll.text(texta[0]);

setInterval(function(){
	textroll.animate({top: 0});
	if(rolli == alen-1){
		textroll.text(texta[rolli]);
		rolli = 0;
	}
	else{		
		textroll.text(texta[rolli]);
		rolli ++;
	}	
},4000)

$("#slides").slides({
		preload: true,
		play: 3000,
		pause: 500,
		hoverPause: true
	});
	var mw = $(".mbox").width()+10;
	var ml = $(".mbox").length;	
	$(".themes").width(mw*ml);
	$(".t_menu li").mouseover(function(){
		var index = $(this).index();
		$(".themes").animate({left:-mw*index,opacity:1},500);
	})
})

$(function(){
	//登陆
	var BackendUrl = "http://chat.tfedu.net:3030/resapi/";
	$('.loginBtn').on('click', function(){
		
		$.ajax({
			url: BackendUrl+ "/resRestAPI/v1.0/users/login",
			data: { user_name: $('input[name=username]').val(), 
				  	user_pwd: $('input[name=passwd]').val()
			}, 
			success: function(data){
				if(data.code == "OK") {
					window.localStorage.setItem("credentialsToken", data.data.token);
					//初始化用户信息
					$.ajax({
						url: BackendUrl+ "/resRestAPI/v1.0/users/" + data.data.userId + '?token=' + data.data.token,
						success: function(data){
							window.localStorage.setItem("ngStorage-authUser", JSON.stringify(data.data));
							window.location.href = '/';
						}
					})
				}else{
					alert("输入不正确")
				}
			},
			error: function(data){
				console.log(data.error)
			}
			
		})
		console.log("login")
	})
 });