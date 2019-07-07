'use strict';

function webreport($timeout, $routeParams, common, datacontext, threatmodellocator) {
    // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
    /*jshint validthis: true */
    var vm = this;
    var controllerId = 'webreport';
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logError = getLogFn(controllerId, 'error');
    vm.title = 'Threat Model Report';
    vm.threatModel = {};
    vm.error = false;
    vm.loaded = false;
    vm.onLoaded = onLoaded;
    vm.onError = onError;
    vm.printPDF = printPDF;

    activate();

    function activate() {
        common.activateController([getThreatModel()], controllerId)
            .then(function () { log('Activated Web Report Controller'); });
    }

    function getThreatModel(forceReload) {

        var location = threatModelLocation();

        return datacontext.load(location, forceReload).then(onLoad, onError);

        function onLoad(data) {
            vm.threatModel = data;
            return vm.threatModel;
        }
    }

    function onLoaded() {
        vm.loaded = true;
        return 'called onLoaded';
    }

    function onError(err) {
        vm.error = err;
        logError(err.data.message);
    }

    function threatModelLocation() {
        return threatmodellocator.getModelLocation($routeParams);
    }

    function printPDF(done) {
        
        //use timeout to ensure the buttons etc. are not visible on the printed page
        //seems ugly, but works
        $timeout(function() {
            window.print();
            done();
        });       
    }
}

module.exports = webreport;