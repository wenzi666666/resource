/**
 * 主模块注入
 * 子模块需要这里面注入
 */
(function() {
    'use strict';

    // Define webApp.coms module
    ApplicationConfiguration.registerModule('webApp.coms');

    //inject sub module
    // 共用header footer 及导航
    ApplicationConfiguration.registerModule('webApp.coms.layout');
    // 登陆
    ApplicationConfiguration.registerModule('webApp.coms.login');
    //系统资源
    ApplicationConfiguration.registerModule('webApp.coms.systemres');
    
}());
