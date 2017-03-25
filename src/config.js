'use strict';

var app = angular.module('app');
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

app.value('config', config);

app.config(['$logProvider', function ($logProvider) {
    // turn debugging off/on (no info or warn)
    if ($logProvider.debugEnabled) {
        $logProvider.debugEnabled(true);
    }
}]);

//Configure the common services via commonConfig
app.config(['commonConfigProvider', function (cfg) {
    cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
}]);