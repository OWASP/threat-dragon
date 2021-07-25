'use strict';

var angular = require('angular');
require('angular-ui-bootstrap');
require('angular-route');
require('angular-xeditable');
require('angular-animate');
window.jQuery = require('jquery');
require('../td.site/src/app/core');

//temporary fix for Chrome/Jointjs problem
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'xeditable', 'ngAnimate', 'templates', 'common', 'tdCore']);
app.constant('VERSION', require('./package.json').version);

//require custom modules, services, controllers and directives
require('./app/config.route');
require('./app/layout');
require('./app/welcome');
require('./app/services');
require('./app/threatmodels');

const globals = require('electron').remote.getGlobal('params');
const log = globals.logger;
const logID = 'Application: ';
log.info(logID + 'logging verbosity level:', log.transports.console.level);
log.debug(logID + 'global model file:', globals.modelFile);
log.debug(logID + 'global command:', globals.command);
log.debug(logID + 'global url:', globals.url);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.run(['$q',
    function ($q) {
        require('any-promise/register')('$q', { Promise: $q });
    }]);

app.run(['$rootScope', '$location',
    function ($rootScope, $location) {
        log.debug(logID + 'original location url', $location.url());
        $location.url(globals.url);
        log.debug(logID + 'changed location url', $location.url());
        $rootScope.location = $location;
    }]);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
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

//electron autoupdate
//Note: autoupdate has been disabled until this issue has been satisfied:
//      https://github.com/mike-goodwin/owasp-threat-dragon-desktop/issues/101
// app.run(['common', 'dialogs', 'electron', 'VERSION', require('./app/config.autoupdate')]);
