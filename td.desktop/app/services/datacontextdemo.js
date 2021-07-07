'use strict';

function datacontextdemo($q, $http) {

    var threatModelUri = 'https://raw.githubusercontent.com/mike-goodwin/owasp-threat-dragon-demo/master/ThreatDragonModels/Demo%20Threat%20Model/Demo%20Threat%20Model.json';

    var service = {
        load: load
    };

    return service;

    function load(forceQuery) {

        if (service.threatModel && !forceQuery) {
            return $q.when(service.threatModel);
        }

        var config = {
            headers: { Accept: 'application/json' }
        };

        return $http.get(threatModelUri, config).then(onLoadedThreatModel, onLoadError);

        function onLoadedThreatModel(result) {
            service.threatModel = result.data;
            return $q.resolve(service.threatModel);
        }

        function onLoadError(err) {
            service.threatModel = null;
            return $q.reject(err);
        }
    }
}

module.exports = datacontextdemo;
