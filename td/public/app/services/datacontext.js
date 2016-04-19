(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['$q', '$http', 'common', datacontext]);

    function datacontext($q, $http, common) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var threatModel = null;

        var service = {
            load: load,
            save: save,
            threatModel: threatModel
        };

        return service;

        function load(threatModelLocation) {
            
            var loc = threatModelLocation;
            var threatModelUri = buildUri(threatModelLocation);

            var request = {
                method: 'GET',
                headers: {Accept: 'application/json'},
                url: threatModelUri 
            };
            
			return $http(request).then(onLoaded, onLoadError);
            
            function onLoaded(result) {
                service.threatModel = result.data;
                service.threatModel.location = loc;
                return $q.when(service.threatModel);
            }
            
            function onLoadError(err) {
                service.threatModel = null;
                return $q.when(err);
            }
        }
        
        function save() {
            
        }
        
        //private functions
        function buildUri(threatModelLocation) {
            
            var uri = 'threatmodel/';
            uri += threatModelLocation.organisation + '/';
            uri += threatModelLocation.repo + '/';
            uri += threatModelLocation.branch + '/';
            uri += threatModelLocation.model;
            
            return uri;
        }

        // diagrams

        // function getThreatModelDiagram(threatModelId, diagramId)
        // {
        //     var deferred = $q.defer();
        //     var diagram = {};

        //     var threatModel = models[threatModelId];

        //     if (threatModel) {

        //         diagram = threatModel.detail.diagrams[diagramId];
                
        //         if (angular.isDefined(diagram)) {
        //             deferred.resolve(diagram);
        //         }
        //         else {
        //             deferred.reject('datacontext: Unable to find diagram id = ' + diagramId);
        //         }
        //     }
        //     else
        //     {
        //         deferred.reject('datacontext: Unable to find threatmodel id = ' + threatModelId);
        //     }

        //     return deferred.promise;
        // }


    }
})();