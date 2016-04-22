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
	}

	//加入备课夹后，动画显示 加入的备课夹
	window.addPrepareAnimation = function() {
		var $list = $('.prepare-ctrls');

		$list.eq(0).addClass('prepare-add');

		$list.find('.ctrls-prepare-list-item').eq(0).addClass('prepare-add-item');

		setTimeout(function() {
			$list.eq(0).removeClass('prepare-add');
			$list.find('.ctrls-prepare-list-item').eq(0).removeClass('prepare-add-item');
		}, 3000)
	}

	/**
	 * 上传文件类型过滤
	 * 
	 */
	window.typeConfirm = function(type) {
		// 图片 素材
		var imgType = ['.jpg', '.png', '.gif'];
		// 文本 素材
		var docType = ['.docx', '.doc', '.dot', '.dotm', '.docm', '.txt', '.pdf', '.wps', '.mht'];
		// ppt 素材
		var pptType = ['.ppt', '.pptx', '.pot', '.potm', '.pptm', '.wpt'];
		// 动画 素材
		var swfType = ['.swf', '.gsp'];
		// 网络 学案
		var webType = ['.html', '.htm'];
		// 视频  素材
		//			var videoType = ['.wmv', '.asf', '.asx', '.rm', '.rmvb', '.mpg', '.mpeg', '.3gp', '.mov', '.mp4', '.m4v', 'avi', 'dat', 'mkv', 'flv', 'vob', 'mts'];
		var videoType = ['.mp4'];
		// 音频  素材
		var audioType = ['.mp3', '.wav', '.wav'];
		// 拓展资源
		var cajType = ['.kdh', '.caj', '.teb', '.nh'];
		// 其他  素材
		var otherType = ['.xls', '.xlsx', '.xlsm', '.rar', '.zip'];

		window.allFormats = imgType.concat(docType, pptType, swfType, webType, videoType, audioType, cajType, otherType);
		
	}

	/**
	 * 打包完成提示
	 */
	window.zipDownloadTips = function(url) {
		var text = "打包成功，会自动弹出下载。<br>如果没有弹出下载，请点击以下链接：<br>" + '<a href="' + url + '" target="_new">点击下载：打包文件</a>';
		$('.alert-modal .modal-inner-content').html(text);
		setTimeout(function() {
			openwin(url);
		}, 1000)
	}

}());