'use strict';

function datacontext($q, $http, common, threatmodellocator) {

    var threatModel = null;
    var threatModelLocation = null;

    var service = {
        repos: repos,
        branches: branches,
        models: models,
        load: load,
        create: create,
        update: update,
        deleteModel: deleteModel,
        saveThreatModelDiagram: saveThreatModelDiagram,
        threatModel: threatModel,
        threatModelLocation: threatModelLocation
    };

    return service;

    function repos(page) {

        var reposUri = 'threatmodel/repos';

        if (page) {
            reposUri += '?page=' + page;
        }

        var config = {
            headers: { Accept: 'application/json' }
        };

        return $http.get(reposUri, config);
    }

    function branches(organisation, repo, page) {

        var branchesUri = 'threatmodel/' + organisation + '/' + repo + '/branches';

        if (page) {
            branchesUri += '?page=' + page;
        }

        var config = {
            headers: { Accept: 'application/json' }
        };

        return $http.get(branchesUri, config);
    }

    function models(organisation, repo, branch) {

        var modelsUri = 'threatmodel/' + organisation + '/' + repo + '/' + branch + '/models';
        var config = {
            headers: { Accept: 'application/json' }
        };

        return $http.get(modelsUri, config);
    }

    function load(location, forceQuery) {

        var loc = {
            organisation: location.organisation,
            repo: location.repo,
            branch: location.branch,
            model: location.model
        };


        //don't refetch if the location has not changed
        if (service.threatModel && JSON.stringify(loc) === JSON.stringify(service.threatModelLocation) && !forceQuery) {
            return $q.when(service.threatModel);
        }

        var threatModelUri = buildUri(loc) + '/data';

        var config = {
            headers: { Accept: 'application/json' }
        };

        return $http.get(threatModelUri, config).then(onLoadedThreatModel, onLoadError);

        function onLoadedThreatModel(result) {
            service.threatModel = result.data;
            service.threatModelLocation = loc;
            return $q.resolve(service.threatModel);
        }

        function onLoadError(err) {
            service.threatModel = null;
            service.threatModelLocation = null;
            return $q.reject(err);
        }
    }

    function create(threatModelLocation, threatModel) {
        var loc = {
            organisation: threatModelLocation.organisation,
            repo: threatModelLocation.repo,
            branch: threatModelLocation.branch,
            model: threatModel.summary.title
        };

        var threatModelUri = buildUri(loc) + '/create';
        service.threatModel = threatModel;

        return $http.put(threatModelUri, threatModel).then(onCreated, onCreateError);

        function onCreated() {
            service.threatModelLocation = loc;
            return $q.resolve({ model: service.threatModel, location: service.threatModelLocation });
        }

        function onCreateError(response){
            service.threatModelLocation = null;
            return $q.reject(response);
        }
    }

    function update() {

        var oldLocation = Object.assign({}, service.threatModelLocation);

        if (oldLocation.model === service.threatModel.summary.title) {
            var threatModelUri = buildUri(service.threatModelLocation) + '/update';
            return $http.put(threatModelUri, service.threatModel);
        } else {
            service.threatModelLocation.model = service.threatModel.summary.title;
            return create(service.threatModelLocation, service.threatModel).then(onCreated).then(onCreateCompleted);
        }

        function onCreated() {
            var cleanUpUri = buildUri(oldLocation);
            return $http.delete(cleanUpUri);
        }

        function onCreateCompleted() {
            return $q.resolve({model: service.threatModel, location: service.threatModelLocation});
        }
    }

    function deleteModel() {

        var threatModelUri = buildUri(service.threatModelLocation);

        return $http.delete(threatModelUri).then(onDeletedModel, onDeleteError);

        function onDeletedModel() {
            service.threatModel = null;
            service.threatModelLocation = null;
            return $q.resolve(service.threatModel);
        }

        function onDeleteError(error) {
            return $q.reject(error);
        }
    }

    function saveThreatModelDiagram(diagramId, diagramData) {

        var diagramToSave = service.threatModel.detail.diagrams.find(function (diagram) {
            return diagram.id == diagramId;
        });

        if (diagramToSave) {
            diagramToSave.diagramJson = diagramData.diagramJson;
            diagramToSave.size = diagramData.size;
            return update();
        } else {
            return $q.reject(new Error('invalid diagram id'));
        }
    }

    function buildUri(threatModelLocation) {

        return 'threatmodel/' + threatmodellocator.getModelPath(threatModelLocation);
    }
}

module.exports = datacontext;