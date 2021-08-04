'use strict';

function welcome($scope, $location, $route, common, electron, threatmodellocator) {

    const log = electron.log;
    const logID = 'Welcome Controller: ';
    log.debug(logID + 'loaded with verbosity level:', electron.logLevel);

    /*jshint validthis: true */
    var fs = require('fs');
    var controllerId = 'welcome';
    var vm = this;
    var logInfo = common.logger.getLogFn(controllerId);
    var logError = common.logger.getLogFn(controllerId, 'error');

    // Bindable properties and functions are placed on vm
    vm.title = 'Welcome';
    vm.openModel = openModel;
    vm.openNewModel = openNewModel;

    activate();

    function activate() {
        log.debug(logID + 'activate at location:', $location.url());
        common.activateController([], controllerId).then(function () { 
                 logInfo('Activated Welcome View');
                 log.info(logID, 'activated');
             });
    }

    function openModel() {
        electron.dialog.open(function (fileNames) {
            log.debug(logID + 'openModel file name:', fileNames[0]);
            var path = threatmodellocator.getModelPath(fileNames[0]);
            if ($location.path() == '/threatmodel/' + path) {
                $route.reload();
            } else {
                $location.path('/threatmodel/' + path);
            }
            log.debug(logID + 'open existing model location:', $location.url());
            $scope.$apply();
        },
        function() {
             log.silly(logID + 'open cancelled');
        });
    }

    function openNewModel(template) {
        log.debug(logID + 'open new model:', template);
        var model = require('../../../ThreatDragonModels/' + template + '/' + template + '.json');
        var success = true;
        electron.dialog.save(function (fileName) {
            fs.writeFileSync( fileName, JSON.stringify(model), 'utf8', function (err) {
                if (err) {
                    logError(err);
                    success = false;
                    log.error(logID + 'error:', err);
                }
            });
            if (success) {
                var path = threatmodellocator.getModelPath( fileName );
                $location.path('/threatmodel/' + path);
                log.debug(logID + 'save to location:', $location.url());
                $scope.$apply();
            }
        },
        function() {
            log.silly(logID + 'save cancelled');
        });
    }
}

module.exports = welcome;
