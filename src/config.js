'use strict';

var core = angular.module('owasp-threat-dragon-core');
var toastr = require('toastr');

// Configure Toastr
toastr.options.timeOut = 4000;
toastr.options.positionClass = 'toast-bottom-right';

var events = {
    controllerActivateSuccess: 'controller.activateSuccess',
};

var config = {
    appErrorPrefix: '[Error] ', //Configure the exceptionHandler decorator
    docTitle: 'Threat Dragon: ',
    events: events,
    version: '0.4.0'
};

core.value('config', config);

core.config(['$logProvider', function ($logProvider) {
    // turn debugging off/on (no info or warn)
    if ($logProvider.debugEnabled) {
        $logProvider.debugEnabled(true);
    }
}]);

//Configure the common services via commonConfig
core.config(['commonConfigProvider', function (cfg) {
    cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
}]);