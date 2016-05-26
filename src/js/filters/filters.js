/**
 * Generic models angular module initialize.
 */
(function() {
    'use strict';
    angular.module('webApp.core.filters', [])
        .filter('codeToHtml', ['$sce', function ($sce) {return function(text){return $sce.trustAsHtml(text)};
        }])
		.filter('html2Text', ['$sce', function ($sce) {
			return function(text){
				//console.log(text.toString())
	            if(!!text) {
	                return $("<div>" + text.toString() + "</div>").text();
	            }else{
	                return;
	            }
			};
        }]).filter('trustHtml', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]).filter('replaceWithEnter', ['$sce', function($sce){
            return function(text){
            	return text.replace(/\n/g, '<br>');
            }
        }]);
}());

