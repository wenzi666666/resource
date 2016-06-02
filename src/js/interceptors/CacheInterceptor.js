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
    angular.module('webApp.core.interceptors')
        .factory('CacheInterceptor',
        function() {
                return {
                    request: function requestCallback(config) {
                    	
						// api打头的都加user做处理
                        if(/\/resRestAPI\//.test(config.url)){
                            //让所有api带上 user请求头
                            if(localStorage.getItem('credentialsToken'))
                                config.headers["Authorization"] = localStorage.getItem('credentialsToken');
                            config.url = config.url + '?noCache=' + new Date().getTime();
                        }
                        return config;
                    }
                };
            }

    );
}());
