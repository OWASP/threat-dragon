(function () {
    'use strict';
    
    
    //temporary fix for Chrome/Jointjs problem
    SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };

    var app = angular.module('app', ['ui.bootstrap', 'ngAnimate' , 'ngRoute', 'common', 'xeditable', 'ngCookies']);

    app.run(['$rootScope', '$location',
    function ($rootScope, $location) {
        
        $rootScope.location = $location;

    }]);

    // Handle routing errors and success events
    app.run(['$route', '$rootScope', 'routemediator',
    function ($route, $rootScope, routemediator) {
        routemediator.setRoutingHandlers();
    }]);
    
    //config for angular-xeditable
    app.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    });

})();