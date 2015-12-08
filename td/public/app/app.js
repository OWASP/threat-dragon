(function () {
    'use strict';

    var app = angular.module('app', [

        'ui.bootstrap',
        'ngRoute',
        'common',
        'xeditable'
    ]);

    app.run(['$rootScope', 'common',
    function ($rootScope, common) {

    }]);

    // Handle routing errors and success events
    app.run(['$route', '$rootScope', 'routemediator',
    function ($route, $rootScope, routemediator) {
        routemediator.setRoutingHandlers();
    }]);
    
    app.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    });

})();