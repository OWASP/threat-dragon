'use strict';

function datacontext($q, electron) {

    const log = electron.log;
    const logID = 'Datacontext Service: ';
    log.debug(logID + 'logging verbosity level:', electron.logLevel);

    var fsp = require('promise-fs');
    var threatModelLocation = null;
    var threatModel = null;
    var lastLoadedLocation = null;

    var service = {
        load: load,
        create: create,
        update: update,
        saveThreatModelDiagram: saveThreatModelDiagram,
        deleteModel: deleteModel,
        close: close,
        saveAs: saveAs,
        threatModelLocation: threatModelLocation,
        threatModel: threatModel,
        lastLoadedLocation: lastLoadedLocation
    };

    return service;

    function load(location, forceQuery) {
        log.debug(logID + 'load location:', location);
        var result;

        service.threatModelLocation = location;
        result = loadFromFile(forceQuery);

        return result.then(onLoaded, onLoadError);

        function onLoaded(model) {
            service.threatModel = model;
            setLocation(service.threatModelLocation);

            log.debug(logID + 'loaded location:', service.threatModelLocation);
            return $q.resolve(service.threatModel);
        }

        function onLoadError(error) {
            service.threatModel = null;
            service.threatModelLocation = null;
            service.lastLoadedLocation = null;
            log.warn(logID + 'load errored', error);
            return $q.reject(error);
        }
    }

    function create(location, model) {
        log.debug(logID + 'create with null location');
        service.threatModelLocation = null;
        return save(model);
    }

    function update() {
        log.debug(logID + 'update model');
        //log.silly(logID + 'update model:', service.threatModel);
        return save(service.threatModel);
    }

    function saveThreatModelDiagram(diagramId, diagramData) {
        log.debug(logID + 'save diagram id:', diagramId);
        var diagramToSave = service.threatModel.detail.diagrams.find(function (diagram) {
            return diagram.id == diagramId;
        });

        if (diagramToSave) {
            diagramToSave.diagramJson = diagramData.diagramJson;
            diagramToSave.size = diagramData.size;
            log.debug(logID + 'save diagram with id:', diagramId);
            return update();
        } else {
            log.warn(logID + 'save diagram id is invalid:', diagramId);
            return $q.reject(new Error('invalid diagram id'));
        }
    }

    function deleteModel() {
        log.debug(logID + 'delete model');

        if (service.threatModelLocation) {
            return fsp.unlink(service.threatModelLocation).then(onDeleted);
        } else {
            log.warn(logID + 'delete model no location specified');
            return $q.reject('No file specified');
        }

        function onDeleted() {
            log.debug(logID + 'delete model successful:', service.threatModelLocation);
            service.threatModel = null;
            service.threatModelLocation = null;
            setLocation(null);
            return $q.resolve(null);
        }
    }

    function close() {
        log.debug(logID + 'close location:', service.threatModelLocation);
        service.threatModel = null;
        service.threatModelLocation = null;
        service.lastLoadedLocation = null;
        electron.currentWindow.setTitle('OWASP Threat Dragon');
    }

    function saveAs() {
        log.debug(logID + 'save as');
        service.threatModelLocation = null;
        return save(service.threatModel);
    }

    function save(model) {
        var deferred = $q.defer();

        if (service.threatModelLocation && service.threatModelLocation != 'demo') {
            log.debug(logID + 'save location:', service.threatModelLocation);
            doSave(service.threatModelLocation);
        } else {
            log.debug(logID + 'save demo file to new location');
            electron.dialog.save(function (fileName) {
                service.threatModelLocation = fileName;
                doSave(service.threatModelLocation);
            },
                onCancel()
            );
        }
        log.silly(logID + 'saved file to location:', service.threatModelLocation);

        return deferred.promise;

        function onCancel() {
            service.threatModelLocation = service.lastLoadedLocation;
            deferred.resolve({ model: service.threatModel, location: { file: service.threatModelLocation } });
        }

        function doSave(location) {
            log.silly(logID + 'saving to location:', location);
            fsp.writeFile(location, JSON.stringify(model,null, 2)).then(
                function() {
                    service.threatModelLocation = location;
                    onSavedThreatModel();
                }, 
                onSaveError);
        }

        function onSavedThreatModel() {
            log.silly(logID + 'saved to location:', service.threatModelLocation);
            setLocation(service.threatModelLocation);
            deferred.resolve({ model: service.threatModel, location: service.threatModelLocation });
        }

        function onSaveError(err) {
            log.silly(logID + 'failed to save to location:', service.threatModelLocation);
            service.threatModelLocation = service.lastLoadedLocation;
            deferred.reject(err);
        }
    }

    function loadFromFile(forceQuery) {
        log.debug(logID + 'load from file:', service.threatModelLocation);
        if (service.threatModel && !forceQuery && service.lastLoadedLocation === service.threatModelLocation) {
            return $q.when(service.threatModel);
        }

        var deferred = $q.defer();
        fsp.readFile(service.threatModelLocation, 'utf8').then(onLoadedThreatModel, onLoadError);

        return deferred.promise;

        function onLoadedThreatModel(result) {
            log.silly(logID + 'loaded from:', service.threatModelLocation);
            var model;
            try {
                model = JSON.parse(result);
            } catch(err) {
                deferred.reject(err);
            }
            service.lastLoadedLocation = service.threatModelLocation;
            deferred.resolve(model);
        }

        function onLoadError(err) {
            deferred.reject(err);
        }
    }

    function setLocation(location) {
        var title;
        if (location) {
            title = 'OWASP Threat Dragon (' + location + ')';
        } else {
            title = 'OWASP Threat Dragon';
        }  
        electron.currentWindow.setTitle(title);
        log.silly(logID + 'set location title:', title);
    }
}

module.exports = datacontext;
