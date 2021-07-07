'use strict';

function datacontext($q, datacontextdemo, electron) {

    const log = electron.log;
    log.debug('Datacontext logging verbosity level', electron.logLevel);

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
        log.debug('Datacontext -> load location', location);
        var result;

        if (location === 'demo') {
            service.threatModelLocation = null;
            service.lastLoadedLocation = null;
            setLocation(service.threatModelLocation);
            result = datacontextdemo.load(forceQuery);
        } else {
            service.threatModelLocation = location;
            result = loadFromFile(forceQuery);
        }

        return result.then(onLoaded, onLoadError);

        function onLoaded(model) {
            service.threatModel = model;
            setLocation(service.threatModelLocation);

            log.debug('Datacontext -> load loaded from', service.threatModelLocation);
            return $q.resolve(service.threatModel);
        }

        function onLoadError(error) {
            service.threatModel = null;
            service.threatModelLocation = null;
            service.lastLoadedLocation = null;
            log.warn('Datacontext -> load errored', error);
            return $q.reject(error);
        }
    }

    function create(location, model) {
        log.debug('Datacontext -> create');
        service.threatModelLocation = null;
        return save(model);
    }

    function update() {
        log.debug('Datacontext -> update');
        return save(service.threatModel);
    }

    function saveThreatModelDiagram(diagramId, diagramData) {
        log.debug('Datacontext -> saveThreatModelDiagram id', diagramId);
        var diagramToSave = service.threatModel.detail.diagrams.find(function (diagram) {
            return diagram.id == diagramId;
        });

        if (diagramToSave) {
            diagramToSave.diagramJson = diagramData.diagramJson;
            diagramToSave.size = diagramData.size;
            log.debug('Datacontext -> saveThreatModelDiagram id', diagramId, 'success');
            return update();
        } else {
            log.warn('Datacontext -> saveThreatModelDiagram invalid id', diagramId);
            return $q.reject(new Error('invalid diagram id'));
        }
    }

    function deleteModel() {
        log.debug('Datacontext -> deleteModel');

        if (service.threatModelLocation) {
            return fsp.unlink(service.threatModelLocation).then(onDeleted);
        } else {
            log.warn('Datacontext -> deleteModel no file specified');
            return $q.reject('No file specified');
        }

        function onDeleted() {
            log.debug('Datacontext -> deleteModel ', service.threatModelLocation, 'success');
            service.threatModel = null;
            service.threatModelLocation = null;
            setLocation(null);
            return $q.resolve(null);
        }
    }

    function close() {
        log.debug('Datacontext -> close loacation', service.threatModelLocation);
        service.threatModel = null;
        service.threatModelLocation = null;
        service.lastLoadedLocation = null;
        electron.currentWindow.setTitle('OWASP Threat Dragon');
    }

    function saveAs() {
        log.debug('Datacontext -> saveAs');
        service.threatModelLocation = null;
        return save(service.threatModel);
    }

    function save(model) {
        log.debug('Datacontext -> save');
        var deferred = $q.defer();

        if (service.threatModelLocation && service.threatModelLocation != 'demo') {
            doSave(service.threatModelLocation);
        } else {
            electron.dialog.save(function (fileName) {
                doSave(fileName);
            },
                onCancel()
            );
        }

        return deferred.promise;

        function onCancel() {
            service.threatModelLocation = service.lastLoadedLocation;
            deferred.resolve({ model: service.threatModel, location: { file: service.threatModelLocation } });
        }

        function doSave(location) {
            fsp.writeFile(location, JSON.stringify(model,null, 2)).then(
                function() {
                    service.threatModelLocation = location;
                    onSavedThreatModel();
                }, 
                onSaveError);
        }

        function onSavedThreatModel() {
            setLocation(service.threatModelLocation);
            deferred.resolve({ model: service.threatModel, location: service.threatModelLocation });
        }

        function onSaveError(err) {
            service.threatModelLocation = service.lastLoadedLocation;
            deferred.reject(err);
        }
    }

    function loadFromFile(forceQuery) {
        log.debug('Datacontext -> loadFromFile from', service.threatModelLocation);
        if (service.threatModel && !forceQuery && service.lastLoadedLocation === service.threatModelLocation) {
            return $q.when(service.threatModel);
        }

        var deferred = $q.defer();
        fsp.readFile(service.threatModelLocation, 'utf8').then(onLoadedThreatModel, onLoadError);

        return deferred.promise;

        function onLoadedThreatModel(result) {
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
        if (location) {
            electron.currentWindow.setTitle('OWASP Threat Dragon (' + location + ')');
        } else {
            electron.currentWindow.setTitle('OWASP Threat Dragon');
        }  
        log.debug('Datacontext -> setLocation title', electron.currentWindow.getTitle());
    }
}

module.exports = datacontext;
