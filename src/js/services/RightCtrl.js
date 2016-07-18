/**
 * Simple storage service which uses browser localStorage service to store
 * application data. Main usage of this is to store user data and JWT token
 * to browser.
 *
 * But this can be also used to cache some data from backend to users browser
 * cache, just remember that local storage IS NOT intended to store "large"
 * amounts of data.
 */
(function() {
    'use strict';
    angular.module('webApp.core.services')
        .factory('RightCtrl', ['$compile', function service($compile) {
            return {
                /** 权限判断
                * @param   [array]    data  ：权限列表
                * @param   string    n : 当前权限
                */
                'hasRight': function getImg(data, current) {
                	var hasRight = false;
                    _.each(data, function(v,i){
                    	if(v.name == current){
                    		hasRight = true;
                    	}
                    })
                    return hasRight;
                }
            }
        }
	])
}());