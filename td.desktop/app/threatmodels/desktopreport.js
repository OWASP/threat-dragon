'use strict';

function desktopreport($q, $routeParams, $location, common, datacontext, threatmodellocator, electron) {

    const globals = electron.globals;
    const log = electron.log;
    log.debug('Desktop Report: logging verbosity level', electron.logLevel);

    var fsp = require('promise-fs');
    /*jshint validthis: true */
    var vm = this;
    var controllerId = 'desktopreport';
    var getLogFn = common.logger.getLogFn;
    var logInfo = getLogFn(controllerId);
    var logSuccess = getLogFn(controllerId, 'success');
    var logError = getLogFn(controllerId, 'error');

    // Bindable properties and functions are placed on vm.
    vm.title = 'Threat Model Report';
    vm.threatModel = {};
    vm.error = null;
    vm.loaded = false;
    vm.onLoaded = onLoaded;
    vm.onError = onError;
    vm.savePDF = savePDF;
    vm.printPDF = printPDF;
    vm.exportPDF = exportPDF;

    activate();

    function activate() {
        common.activateController([getThreatModel()], controllerId)
            .then(function () {
                logInfo('Activated Desktop Report Controller');
                log.info('Activated Desktop Report Controller');
                onActivated();
            });
    }

    function onActivated() {
        //do any commands
        if (globals.command == "pdf") {
            setTimeout(function() {
                exportPDF();
                log.info('Export model', globals.modelFile, "to pdf");
            }, (2 * 1000));
        }
    }

    function getThreatModel(forceReload) {
        var location = threatModelLocation();
        log.debug('Desktop Report: get Threat Model from location', location);

        return datacontext.load(location, forceReload).then(onLoad, onError);

        function onLoad(data) {
            vm.threatModel = data;
            return vm.threatModel;
        }
    }

    function onLoaded() {
        log.debug('Desktop Report: loaded Threat Model location', threatModelLocation());
        vm.loaded = true;
        return 'called onLoaded';
    }

    function onError(err) {
        vm.error = err;
        logError(err.data.message);
        log.error('Desktop Report:', err.data.message);
    }

    function exitApp() {
        let win = require('electron').remote.getCurrentWindow();
        log.debug('Desktop Report: exit app');
        win.close();
    }

    function threatModelLocation() {
        return threatmodellocator.getModelLocation($routeParams);
    }

    function exportPDF() {
        log.debug('Desktop Report: export PDF');
        electron.currentWindow.webContents.printToPDF({
            landscape: false,
            marginsType: 0,
            printBackground: false,
            printSelectionOnly: false,
            pageSize: 'A4',
        }).then(data => {

            var pdfPath = datacontext.threatModelLocation.replace('.json', '.pdf');
            log.silly('Desktop Report: on export PDF to', pdfPath);

            fsp.writeFile(pdfPath, data).then(function() { 
                log.debug('Desktop Report: exported PDF to', pdfPath);
                //close the app after export
                exitApp();
            }).catch(error => {
                onError(error);
                //close the app on error
                exitApp();
            });

        }).catch(error => {
            onError(error);
            //close the app on error
            exitApp();
        });
    }

    function savePDF(done) {
        log.debug('Desktop Report: save PDF');

        electron.currentWindow.webContents.printToPDF({
            landscape: false,
            marginsType: 0,
            printBackground: false,
            printSelectionOnly: false,
            pageSize: 'A4',
        }).then(data => {

            var defaultPath = null;
            log.debug('Desktop Report: on save PDF');

            if (datacontext.threatModelLocation) {
                defaultPath = datacontext.threatModelLocation.replace('.json', '.pdf');
            }

            electron.dialog.saveAsPDF(defaultPath, function (fileName) {
                fsp.writeFile(fileName, data).then(function() { 
                    log.debug('Desktop Report: saved PDF');
                    done();
                });
            },
            function() {
                logInfo('Cancelled save threat model');
                log.info('Desktop Report: cancelled save threat model');
                done();
            });

        }).catch(error => {
            done();
            onError(error);
        });
    }

    function printPDF(done) {
        log.debug('Desktop Report: print PDF');
        //use default print options
        electron.currentWindow.webContents.print({}, (success, errorType) => {
            if (success) {
                logSuccess('Report printed successfully');
                log.info('Desktop Report: printed successfully');
            } else {
                logError('Report printing failed: ' + errorType);
                log.error('Desktop Report: printing failed:', errorType);
            }
            done();
        });
    }
}

module.exports = desktopreport;
