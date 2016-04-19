(function() {
	/**
	 *新窗口打开页面或下载内容
	 * 用a标签实现是为了不被 浏览器拦截
	*/
	window.openwin = function(url) {
		console.log("test open win");
		var a = document.createElement("a");
		a.setAttribute("href", url);
		a.setAttribute("target", "_new");
		document.body.appendChild(a);
		a.click();
	}
	/**
	 * juqery加入备课夹动画
	 * 飞入效果
	*/
	window.addToPrepareAnimation = function() {

		$(".addPrepare").click(function(event) {

			var addcar = $(this);
			var offset = $(".prepare-fixed").offset();
			var img = addcar.parent().parent().find('.prepare-shop');
			var flyer = $('<img class="u-flyer" style="max-width:150px" src="' + img.attr('src') + '">');
			flyer.fly({
				start: {
					left: img.offset().left,
					top: event.clientY - 30
				},
				end: {
					left: offset.left + 10,
					top: document.documentElement.clientHeight - 380,
					width: 0,
					height: 0
				},
				onEnd: function() {
					$('.u-flyer').remove(); //移除dom
				}
			});
		});

		$(".addPrepareInner").click(function(event) {

			var addcar = $(this);
			var offset = $(".prepare-fixed").offset();
			var img = addcar.parent().parent().parent().parent().find('.prepare-shop');
			var flyer = $('<img class="u-flyer" style="max-width:150px" src="' + img.attr('src') + '">');
			flyer.fly({
				start: {
					left: img.offset().left,
					top: event.clientY - 30
				},
				end: {
					left: offset.left + 10,
					top: document.documentElement.clientHeight - 380,
					width: 0,
					height: 0
				},
				onEnd: function() {
					$('.u-flyer').remove(); //移除dom
				}
			});
		});
		
		// 全选或多选加入备课夹
//		$(".addPrepareAll").click(function(event) {
//			
//			var addcar = $(this);
//			var offset = $(".prepare-fixed").offset();
//			var img = $('.res-list-main');
//			var flyer = img.clone(true);
//			flyer.fly({
//				start: {
//					left: img.offset().left,
//					top: event.clientY - 30
//				},
//				end: {
//					left: offset.left + 10,
//					top: document.documentElement.clientHeight - 380,
//					width: 0,
//					height: 0
//				},
//				onEnd: function() {
//					$('.u-flyer').remove(); //移除dom
//				}
//			});
//		});

		/**
		 * 上传文件类型过滤
		 * 
		*/
		window.typeConfirm = function(type) {
			// 图片 素材
			var imgType = ['jpg', 'jpeg', 'png', 'gif'];
			// 文本 素材
			var docType = ['docx', 'doc', 'txt', 'pdf', 'wps'];
			// ppt 素材
			var pptType = ['ppt', 'pptx', 'pptm', 'wpt'];
			// 动画 素材
			var swfType = ['swf', 'gsp', 'exe', '3ds'];
			// 网络 学案
			var webType = ['html', 'htm'];
			// 视频  素材
			var videoType = ['wmv', 'asf', 'asx', 'rm', 'rmvb', 'mpg', 'mpeg', '3gp', 'mov', 'mp4', 'm4v', 'avi', 'dat', 'mkv', 'flv', 'vob', 'mts'];
			// 音频  素材
			var audioType = ['cd', 'ogg', 'mp3', 'wma', 'wav', 'rm', 'midi', 'vqf'];
			// 其他  素材
			var webType = ['xls', 'xlsx'];
			// 拓展资源
			var cajType = ['kdh', 'caj'];
		}

	}

}());