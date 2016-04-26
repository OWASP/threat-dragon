(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['$q', '$http', '$window', 'common', datacontext]);

    function datacontext($q, $http, $window, common) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var threatModel = null;

        var service = {
            repos: repos,
            branches: branches,
            models: models,
            load: load,
            create: create,
            threatModel: threatModel
        };

        return service;
        
        function repos() {
            
            var reposUri = 'threatmodel/repos';
            var request = {
                method: 'GET',
                headers: { Accept: 'application/json' },
                url: reposUri
            };

            return $http(request);
        }
        
        function branches(organisation, repo) {
            
            var branchesUri = 'threatmodel/' + organisation + '/' + repo + '/branches';
             var request = {
                method: 'GET',
                headers: { Accept: 'application/json' },
                url: branchesUri
            };
            
            return $http(request);
        }
        
        function models(organisation, repo, branch) {
            
            var modelsUri = 'threatmodel/' + organisation + '/' + repo + '/' + branch + '/models';
             var request = {
                method: 'GET',
                headers: { Accept: 'application/json' },
                url: modelsUri
            };
            
            return $http(request);
        }

        function load(threatModelLocation, forceQuery) {
            
            var loc = {
                organisation: threatModelLocation.organisation,
                repo: threatModelLocation.repo,
                branch: threatModelLocation.branch,
                model: threatModelLocation.model
            };
            
            
            //don't refetch if the location has not changed
            if (service.threatModel && JSON.stringify(loc) === JSON.stringify(service.threatModel.location) && !forceQuery) {
                return $q.when(service.threatModel);
            }
                
            var threatModelUri = buildUri(loc) + '/data';

            var request = {
                method: 'GET',
                headers: {Accept: 'application/json'},
                url: threatModelUri 
            };
            
			return $http(request).then(onLoadedThreatModel, onLoadError);
            
            function onLoadedThreatModel(result) {
                service.threatModel = result.data;
                service.threatModel.location = loc;
                return $q.resolve(service.threatModel);
            }
        }
        
        function create(threatModelLocation, threatModel) {
            var loc = {
                organisation: threatModelLocation.organisation,
                repo: threatModelLocation.repo,
                branch: threatModelLocation.branch,
                model: threatModel.summary.title.replace(' ', '_')
            };
            
            var threatModelUri = buildUri(loc) + '/create';
            
            var request = {
                method: 'PUT',
                url: threatModelUri,
                data: threatModel
            };
            
            return $http(request);
        }

        //private functions
        function onLoadError(err) {
            service.threatModel = null;
            return $q.reject(err);
        }
        
        function buildUri(threatModelLocation) {

            var uri = 'threatmodel/';
            uri += threatModelLocation.organisation + '/';
            uri += threatModelLocation.repo + '/';
            uri += threatModelLocation.branch + '/';
            uri += threatModelLocation.model;
            
            return uri;
        }
    }
})();