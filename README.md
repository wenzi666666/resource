# 新版资源平台

- bootstrap
- angular.js
- fontawesome

## 研发环境运行
> npm install
> gulp

## 生产环境运行
- 1.首次运行
> npm install
> gulp //测试是否能启动
> gulp dist  //打包压缩
> node server   //后台启动用 nohup node server &
启动在6060端口（可修改server.js中的port值）


- 1.更新升级
> git pull
> gulp dist
服务不用重启

## 要求
- css 用less开发
- js angular.js ionic