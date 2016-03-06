var express = require('express');
var history = require('connect-history-api-fallback');
var serveStatic = require('serve-static');
var compression = require('compression');

//端口
var port = 6060;
var app = express();
//浏览器刷新
app.use(history());
//gzip
app.use(compression())
//文件内容
app.use(serveStatic('dist', {'index': ['index.html']}));
//服务
app.listen(port,function(){
	console.log('Server on http://localhost:%s', port);
})