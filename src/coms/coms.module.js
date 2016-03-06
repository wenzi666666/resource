(function() {
    'use strict';

    // Define frontend.coms module
    ApplicationConfiguration.registerModule('webApp.coms');

    //inject module
    
    // Module configuration
    angular.module('webApp.coms')
        .config(
            [
                '$stateProvider',
                function($stateProvider) {
                    $stateProvider
                        .state('coms', {
                            parent: 'webApp',
                            data: {
                                access: 1
                            },
                            views: {
                                'content@': {
                                    controller: ['$state',function($state) {
                                            $state.go('login');

                                    }]
                                }

                            }
                        })
                    ;
                }
            ]
        );
}());
