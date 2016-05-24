# 新版资源平台

- bootstrap
- angular.js
- fontawesome

## 研发环境运行
> 复制config/webconfig_example.js为webconfig.js,并修改对应的 TomcatUrl后端地址
> npm install
> gulp

## 生产环境运行
- 1.首次运行
> npm install
> gulp //测试是否能启动
> gulp dist  //打包压缩
> node server   //后台启动用 nohup node server &
启动在12306端口（可修改resweb.js中的port值）


- 1.更新升级
> git pull
> gulp dist
服务不用重启

## 要求
- css 用less开发
- js angular.js bootstrap fontawsome