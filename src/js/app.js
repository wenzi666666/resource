/**
 * 主入口文件
 * 核心模块 引入
 * 定义基本对api请求的处理
 */
(function() {
	//依赖的模块 注入
	var module = ['ui.router','ngAnimate', 'ui.bootstrap', 'ngResource', 'ngStorage', 'tmp', 'treeControl']
	
	angular.module('webApp', module)
	//初始化
	// .run(['', function() {

	// }])
	.config(['$httpProvider', '$urlRouterProvider', '$locationProvider',function($httpProvider, $urlRouterProvider, $locationProvider) {
		//默认登陆页 认证成功后默认动态页
//		if(window.localStorage.getItem("credentials")) 
//			$urlRouterProvider.otherwise('/nav/info');
//		else
			$urlRouterProvider.otherwise('/systemres');
			
		// url格式
		 $locationProvider.html5Mode(true).hashPrefix('!');
		 
		//注入
		$httpProvider.interceptors.push('CacheInterceptor');

		//设置请求头格式
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = false;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		// Override $http service's default transformRequest
		$httpProvider.defaults.transformRequest = [function(data) {
			/**
			 * The workhorse; converts an object to x-www-form-urlencoded serialization.
			 * @param {Object} obj
			 * @return {String}
			 */
			var param = function(obj) {
				var query = '';
				var name, value, fullSubName, subName, subValue, innerObj, i;

				for (name in obj) {
					value = obj[name];

					if (value instanceof Array) {
						for (i = 0; i < value.length; ++i) {
							subValue = value[i];
							fullSubName = name + '[]'; //+ '[' + i + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if (value instanceof Object) {
						for (subName in value) {
							subValue = value[subName];
							fullSubName = name + '[' + subName + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if (value !== undefined && value !== null) {
						query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
					}
				}

				return query.length ? query.substr(0, query.length - 1) : query;
			};

			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
	}])

	window.ApplicationConfiguration = (function() {
		// Init module configuration options
		var applicationModuleName = 'webApp';
		var applicationModuleVendorDependencies = module;

		// Add a new vertical module
		var registerModule = function(moduleName) {
			// Create angular module
			angular.module(moduleName, []);

			// Add the module to the AngularJS configuration file
			angular.module(applicationModuleName).requires.push(moduleName);
		};

		return {
			applicationModuleName: applicationModuleName,
			applicationModuleVendorDependencies: applicationModuleVendorDependencies,
			registerModule: registerModule
		};
	})();

	//注入 核心模块
	ApplicationConfiguration.registerModule('webApp.core.services');
	ApplicationConfiguration.registerModule('webApp.core.directives');
	ApplicationConfiguration.registerModule('webApp.core.filters');

})();