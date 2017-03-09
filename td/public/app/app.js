
'use strict';

var angular = require('angular');
require('angular-route');
require('angular-xeditable');
require('angular-animate');
var $ = window.jQuery = require('jquery');

//temporary fix for Chrome/Jointjs problem
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'common', 'xeditable', 'ngAnimate']);

//require custom modules, services, controllers and directives
require('./config.route');
require('./config');
require('./common');
require('./services');
require('./diagrams');
require('./layout');
require('./welcome');
app.directive('tmtPager', [require('./directives')]);

//extend exception handler
app.config(['$provide', function ($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', 'config', 'logger', require('./config.exceptionHandler')]);
}]);

//add location to root scope
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
app.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3';
}]);
