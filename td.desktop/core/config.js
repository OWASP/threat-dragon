'use strict';

var core = require('angular').module('tdCore');
var toastr = require('toastr');

// Configure Toastr
toastr.options.timeOut = 1000;
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
    // if ($logProvider.debugEnabled) {
    //     $logProvider.debugEnabled(true);
    // }
    $logProvider.debugEnabled(false);
}]);

//Configure the common services via commonConfig
core.config(['commonConfigProvider', function (cfg) {
    cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
}]);