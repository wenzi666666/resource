/**
 * Auth interceptor for HTTP and Socket request. This interceptor will add required
 * JWT (Json Web Token) token to each requests. That token is validated in server side
 * application.
 *
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-introduction/
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-examples/
 */
(function() {
    'use strict';
	ApplicationConfiguration.registerModule('webApp.core.interceptors');
    angular.module('webApp.core.interceptors')
        .factory('CacheInterceptor',
        function() {
                return {
                    request: function requestCallback(config) {
                    	
						// api打头的都加user做处理
                        if(/\/api\//.test(config.url)){
                            var separator = config.url.indexOf('?') === -1 ? '?' : '&';
//                          config.url = config.url+separator+'noCache=' + new Date().getTime();
                            //让所有api带上 user请求头
                            if(localStorage.getItem('auth_token'))
                                config.url = config.url + "?user=" + JSON.parse(localStorage.getItem('auth_token')).user.username;
                        }
            
//                       config.headers['SM_USER'] = "frank";
//                       if (angular.isDefined(config.headers)) {
//					        config.headers['Request-Header'] = "frank";
//					      }
//					                        config.headers['aaaaaaa'] = "frank";

                        return config;
                    }
                };
            }

    );
}());
