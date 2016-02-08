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
        
        if (angular.isDefined(modelsJson) && modelsJson !== null) { models = JSON.parse(modelsJson); }

        var service = {
            clearStorage: clearStorage,
            getThreatModelCount: getThreatModelCount,
            getThreatModelSummaries: getThreatModelSummaries,
            saveThreatModel: saveThreatModel,
            deleteThreatModel: deleteThreatModel,
            getThreatModelDetail: getThreatModelDetail,
            getAllThreatModelDetails: getAllThreatModelDetails,
            getThreatModelDiagram: getThreatModelDiagram,
            saveThreatModelDiagram: saveThreatModelDiagram
        };

        return service;

        function clearStorage()
        {
            models = [];
            localStorage.removeItem('models');
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

        function deleteThreatModel(index)
        {
            var model = models[index];
            models.splice(index, 1);
            localStorage.setItem('models', JSON.stringify(models));
            return $q.when(model);
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