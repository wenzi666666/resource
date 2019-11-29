# 知好乐编辑器

> 基于百度编辑修改
> 支持视频 音频 附件 图片 资源插入

## 使用方式
- 建议以iframe形式加载
- 嵌入方式

```
	<!--style给定宽度可以影响编辑器的最终宽度-->
	<iframe id="testEditor" class="zhlEditor" src="editor/editor.html?uploadUrl=xxxxxxx" frameborder="0" width="100%" height="530"></iframe>
	
	// xxxx部分 上传文件服务地址
	
	由后端实现后直接拼好
	eg:
	var param="filePath="+path;
		$.ajax({
			cache:false,
			type:"POST",
			async : false,
			url: uploadUrl,
			data:param,
			success:function(data){
				console.log(data)
				// window.uploadServerUrl =  data.fileUploadUrl + "&ver=1";
				// // 文件服务器地址
				// window.FileServerUrl = data.fileUploadUrl.split('push.do')[0] + 'nor/';
			}
	})
```


- 获取值方式
```
	// 编辑器iframe， 其中id为iframe id， id必须唯一
	var editor = document.getElementById("testEditor").contentWindow;
		    	
	// 取值, 固定写法
	var content = editor.replaceContent(editor.$('#zhlEditor').html());
	// 显示内容
	$("#test").text(content)
```

- 设置方式
```
	// 传回编辑器编辑
	// 编辑器iframe， 其中id为iframe id， id必须唯一
	var editor = document.getElementById("testEditor").contentWindow;
		    	
	// 设值
	editor.$('#zhlEditor').html(editor.setContent($('#test').text()));
	
```

- 增加 文件服务器路径
```
	var content = $("#zhlEditor").contentWindow.addServerToPath(value);
```

