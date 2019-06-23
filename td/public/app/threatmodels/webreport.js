'use strict';

function webreport($q, $routeParams, $location, common, datacontext) {
    // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
    /*jshint validthis: true */
    var vm = this;
    var controllerId = 'webreport';
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logError = getLogFn(controllerId, 'error');

    // Bindable properties and functions are placed on vm.
    vm.title = 'Threat Model Report';
    vm.error = null;
    vm.loaded = false;
    vm.onLoaded = onLoaded;
    vm.onError = onError;

    activate();

    function activate() {
        common.activateController([load()], controllerId)
            .then(function () { log('Activated WebReport Controller'); });
    }

    function load() {
        //do all the loading stuff
    }

    function onLoaded() {
        vm.loaded = true;
        return 'called onLoaded';
    }

    function onError(err) {
        vm.error = err;
        logError(err.data.message);
    }
}

module.exports = webreport;