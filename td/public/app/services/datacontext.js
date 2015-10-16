(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['$q', 'common', datacontext]);

    function datacontext($q, common) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');

        var modelsJson = localStorage.getItem('models');
        var models = [];
        
        if (angular.isDefined(modelsJson)) { models = JSON.parse(modelsJson); }

        var service = {
            clearStorage: clearStorage,
            getThreatModelCount: getThreatModelCount,
            getThreatModelSummaries: getThreatModelSummaries,
            saveThreatModel: saveThreatModel,
            deleteThreatModel: deleteThreatModel,
            getThreatModelDetail: getThreatModelDetail,
            getAllThreatModelDetails: getAllThreatModelDetails,
            getThreatModelDiagram: getThreatModelDiagram,
            saveThreatModelDiagram: saveThreatModelDiagram,
            getElementProperties: getElementProperties,
            saveElementProperties: saveElementProperties,
            deleteElementProperties: deleteElementProperties
        };

        return service;

        function clearStorage()
        {
            models = [];
            localStorage.clear();
            return $q.when(models);
        }

        //threat models

        function getThreatModelCount()
        {
            var count = models.length;
            return $q.when(count);
        }

        function getThreatModelSummaries()
        {
            var threatModelSummaries = [];
            models.forEach(addThreatModelSummary);                
            return $q.when(threatModelSummaries);

            function addThreatModelSummary(threatModel)
            {
                threatModelSummaries.push(threatModel.summary);
            }
        }

        function saveThreatModel(threatModel)
        {
            if (threatModel)
            {
                if (angular.isUndefined(threatModel.summary.id))
                {
                    //new model
                    var newId = getNewThreatModelKey();
                    threatModel.summary.id = newId;
                }
                
                models[threatModel.summary.id] = threatModel;
                localStorage.setItem('models', JSON.stringify(models));
            }

            return $q.when(threatModel);
        }

        function deleteThreatModel(threatModel)
        {
            models.splice(threatModel.summary.id, 1);
            localStorage.setItem('models', JSON.stringify(models));
            return $q.when(threatModel);
        }

        function getAllThreatModelDetails()
        {            
            return $q.when(models);
        }

        function getThreatModelDetail(id)
        {
            var threatModel = models[id];
            return $q.when(threatModel);
        }

        // diagrams

        function getThreatModelDiagram(threatModelId, diagramId)
        {
            var deferred = $q.defer();
            var diagram = {};

            var threatModel = models[threatModelId];

            if (threatModel) {

                diagram = threatModel.detail.diagrams[diagramId];
                
                if (angular.isDefined(diagram)) {
                    deferred.resolve(diagram);
                }
                else {
                    deferred.reject('datacontext: Unable to find diagram id = ' + diagramId);
                }
            }
            else
            {
                deferred.reject('datacontext: Unable to find threatmodel id = ' + threatModelId);
            }

            return deferred.promise;
        }

        function saveThreatModelDiagram(threatModelId, diagramId, diagramData)
        {
            var threatModel = models[threatModelId];
            var diagram = threatModel.detail.diagrams[diagramId];
            diagram.diagramJson = diagramData.diagramJson;
            diagram.size = diagramData.size;
            localStorage.setItem('models', JSON.stringify(models));
            return $q.when(null);
        }

        //diagram element properties

        function getElementProperties(threatModelId, diagramId, elementId)
        {
            var elementProperties = models[threatModelId].elementProperties[elementId];
            return $q.when(elementProperties);
        }

        function saveElementProperties(elementProperties)
        {
            //generate a key for new threats
            if (angular.isDefined(elementProperties.threats))
            {
                elementProperties.threats.forEach(function (threat, index, threats) {
                    if (angular.isUndefined(threat.id)) {
                        var newKey = 0;
                        var keys = _.keys(threats);
                        
                        if (keys.length > 0) { newKey = parseInt(_.max(keys)) + 1; }
                        threat.id = newKey;
                    }
                });
            }
            
            var threatModelId = elementProperties.threatModelId;
            var diagramId = elementProperties.diagramId;
            var elementId = elementProperties.elementId;
            
            var model = models[threatModelId];
            
            if (angular.isUndefined(model.elementProperties)) { model.elementProperties = {}; }
            
            model.elementProperties[elementId] = elementProperties;
            localStorage.setItem('models', JSON.stringify(models));

            return $q.when(elementProperties);
        }

        function deleteElementProperties(threatModelId, diagramId, elementId)
        {
            var properties = models[threatModelId].elementProperties[elementId];
            delete models[threatModelId].elementProperties[elementId];
            localStorage.setItem('models', JSON.stringify(models));
            return $q.when(properties);
        }


        //key management methods

        function getNewThreatModelKey()
        {
            var newKey = 0;
            var keys = _.keys(models);
            
            if (keys.length > 0) { newKey = parseInt(_.max(keys)) + 1; }
            
            return newKey;
        }
    }
})();