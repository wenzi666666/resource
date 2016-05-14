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
});


$(function(){
	//登陆
	var clickNum=0;
	var loginSubmit = function(){
		// 验证码
		if($(".showBox").css("display")=="block")
		{
			var inputCode=$("#validCode").val().toLowerCase();
			var getCode=$(".showCode").text().toLowerCase();
			if(inputCode!=getCode)
			{
				alert("验证码输入错误，请重新输入");
				return false;
			}
		}
		
		var username = $('input[name=username]').val();
		var psssword = $('input[name=passwd]').val();
		if(!username){
			alert('用户名不能为空');
			return;
		}
		if(!psssword){
			alert('密码不能为空');
			return;
		}
		$.ajax({
			url: BackendUrl+ "/resRestAPI/v1.0/users/login",
			data: { user_name: username, 
				  	user_pwd: psssword,
				  	target: TomcatUrl,
				  	noCache: new Date().getTime()
			}, 
			success: function(data){
				if(data.code == "OK") {
					window.localStorage.setItem("credentialsToken", data.data.token);
					// 是否记住密码
					if($('#checkFlag').prop("checked")) {
						keep_select(true)
					}
					//初始化用户信息
					$.ajax({
						url: BackendUrl+ "/resRestAPI/v1.0/users/" + data.data.userId + '?token=' + data.data.token + '&target=' + TomcatUrl,
						success: function(data){
							window.localStorage.setItem("ngStorage-authUser", JSON.stringify(data.data));
							window.location.href = '/';
						}
					})
				}else{
					alert("用户名或密码不正确");
					clickNum++;
					if(clickNum>=3)
					{
						$(".showBox").show();
						//获取验证码
						getVerification(BackendUrl);
					}
				}
			},
			error: function(data){
				console.log(data.error);
			}
		})
	};
	// 绑定登陆
	$('.loginBtn').on('click', loginSubmit);
	// 监听回车
	$(document).keypress(function(e) {  
	    // 回车键事件  
	    if(e.which == 13) {
	    	loginSubmit()
	    }
	}); 
	
	// 记住密码直接加载
	if(window.localStorage.getItem("res-credential")){
		var user = JSON.parse(window.localStorage.getItem("res-credential"))
		$('input[name=username]').val(user.username);
		$('input[name=passwd]').val(user.pwd);
	}
 });
 
function getVerification(BackendUrl)
{
	$.ajax({
			url: BackendUrl+ "/resRestAPI/v1.0/verificationcode",
			data: {
			}, 
			success: function(data){
				if(data.code == "OK") {
					$(".showCode").text(data.data);
				}else{
					alert("系统异常，请联系管理员");
				}
			},
			error: function(data){
				alert(data.error);
			}
		});
}

//忘记密码提示
function pwd_tip(){
	alert("忘记密码了？请联系管理员帮助重置密码~");
}

function register(){
	window.location.href = "http://zy.tfedu.net/register_new/index.jsp";
}
//记住密码
function keep_select(rem){
	console.log($('#checkFlag').prop("checked"))
	if($('#checkFlag').prop("checked") && !!rem){
		var username = $('input[name=username]').val();
		var psssword = $('input[name=passwd]').val();
		var userinfo = {
			username:username,
			pwd:psssword
		}
		window.localStorage.setItem("res-credential", JSON.stringify(userinfo));
	}else{
		window.localStorage.removeItem("res-credential");
	}
	
}
