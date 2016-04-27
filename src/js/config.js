// 全局配置文件

// 后端jsonapi代理
window.BackendUrl = "http://127.0.0.1:3366/api";
//window.BackendUrl = "http://192.168.111.204:8880";
// 后端tomcat服务
window.TomcatUrl = "http://127.0.0.1:90";
// 文件服务
window.FileServer =  "http://192.168.111.22/";
// 缩略图回滚服务
window.IconServer = "assets/resicon/";

//图片压缩
//图片缩略图 最小
window.imgSmallThumb= '?imageMogr2/thumbnail/200x200';
//缩略图尺寸 中等
window.imgMiddleThumb = "?imageMogr2/gravity/Center/crop/200x100";
// 主题页 缩略图
window.imgTopicThumb = '?imageView2/2/w/200';
//手机端图片最大尺寸
window.imgLargeCompress = '?imageMogr2/thumbnail/400x600';

// 研发时 特殊处理，研发在端口在3000,使用公用代理
if(window.location.port == "3000" || window.location.hostname == "chat.tfedu.net"){
	BackendUrl = "http://chat.tfedu.net:3366/api";
	TomcatUrl = "http://192.168.111.204:8880";
}