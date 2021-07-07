'use strict';

function welcome($scope, $location, $route, common, electron, threatmodellocator) {

    const log = electron.log;
    log.debug('Welcome loaded with verbosity level', electron.logLevel);

    /*jshint validthis: true */
    var fs = require('fs');
    var controllerId = 'welcome';
    var logError = common.logger.getLogFn(controllerId, 'error');
    var vm = this;
    var getLogFn = common.logger.getLogFn;
    var logInfo = getLogFn(controllerId);

    // Bindable properties and functions are placed on vm
    vm.title = 'Welcome';
    vm.openModel = openModel;
    vm.openNewModel = openNewModel;

    activate();

    function activate() {
        log.debug('Welcome -> activate at location.url', $location.url());
        common.activateController([], controllerId).then(function () { 
                 logInfo('Activated Welcome View');
                 log.info('Activated Welcome View');
             });
    }

    function openModel() {
        electron.dialog.open(function (fileNames) {
            log.debug('Welcome -> openModel file name', fileNames[0]);
            var path = threatmodellocator.getModelPath(fileNames[0]);
            if ($location.path() == '/threatmodel/' + path) {
                $route.reload();
            } else {
                $location.path('/threatmodel/' + path);
            }
            log.debug('Welcome -> openModel -> location.url', $location.url());
            $scope.$apply();
        },
        function() {});
    }

    function openNewModel() {
        log.debug('Welcome -> openNewModel');
        var model = { summary: { title: "New Threat Model" }, detail: { contributors: [], diagrams: [] } };
        var success = true;
        electron.dialog.save(function (fileName) {
            fs.writeFileSync( fileName, JSON.stringify(model), 'utf8', function (err) {
                if (err) {
                    logError(err);
                    success = false;
                    log.error(err);
                }
            });
            if (success) {
                var path = threatmodellocator.getModelPath( fileName );
                $location.path('/threatmodel/' + path);
                log.debug('Welcome -> openNewModel -> location.url', $location.url());
                $scope.$apply();
            }
        },
        function() {});
    }
}

module.exports = welcome;
