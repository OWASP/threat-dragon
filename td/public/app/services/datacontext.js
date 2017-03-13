'use strict';

function datacontext($q, $http, common) {

    var threatModel = null;

    var service = {
        repos: repos,
        branches: branches,
        models: models,
        load: load,
        create: create,
        update: update,
        deleteModel: deleteModel,
        saveThreatModelDiagram: saveThreatModelDiagram,
        threatModel: threatModel
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

        var config = {
            headers: { Accept: 'application/json' }
        };

        return $http.get(threatModelUri, config).then(onLoadedThreatModel, onLoadError);

        function onLoadedThreatModel(result) {
            service.threatModel = result.data;
            service.threatModel.location = loc;
            return $q.resolve(service.threatModel);
        }

        function onLoadError(err) {
            service.threatModel = null;
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

        threatModel.location = loc;
        service.threatModel = threatModel;

        return $http.put(threatModelUri, threatModel);
    }

    function update() {

        var oldLocation = Object.assign({}, service.threatModel.location);

        if (oldLocation.model === service.threatModel.summary.title) {
            var threatModelUri = buildUri(service.threatModel.location) + '/update';
            return $http.put(threatModelUri, service.threatModel);
        } else {
            service.threatModel.location.model = service.threatModel.summary.title;
            return create(service.threatModel.location, service.threatModel).then(onCreated);
        }

        function onCreated() {
            var cleanUplUri = buildUri(oldLocation);
            return $http.delete(cleanUplUri);
        }
    }

    function deleteModel() {

        var threatModelUri = buildUri(service.threatModel.location);

        return $http.delete(threatModelUri).then(onDeletedModel, onDeleteError);

        function onDeletedModel() {
            service.threatModel = null;
            return $q.resolve(service.threatModel);
        }

        function onDeleteError(error) {
            return $q.reject(error);
        }
    }

    function saveThreatModelDiagram(diagramId, diagramData) {

        //console.log(service.threatModel.detail.diagrams);

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

        var uri = 'threatmodel/';
        uri += threatModelLocation.organisation + '/';
        uri += threatModelLocation.repo + '/';
        uri += threatModelLocation.branch + '/';
        uri += threatModelLocation.model;

        return uri;
    }
}

module.exports = datacontext;