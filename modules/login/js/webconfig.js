// 前端代理
var BackendUrl = window.location.protocol + "//" + window.location.hostname + ":3366/api1";
// 后端服务
var TomcatUrl = "http://127.0.0.1:8090";

// 研发时 特殊处理，研发在端口在3000,使用公用代理
if(window.location.port == "3000" || window.location.hostname == "chat.tfedu.net"){
	BackendUrl = "http://chat.tfedu.net:3366/api1";
	TomcatUrl = "http://192.168.111.204:8880";
}
