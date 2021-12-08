'use strict';

function threatmodellocator() {

    var service = {
        getModelLocation: getModelLocation,
        getModelPath: getModelPath,
        getModelPathFromRouteParams: getModelPath,
        willMoveModel: willMoveModel,
        newModelLocation: '/new/threatmodel'
    };

    return service;

    function getModelLocation(params) {

        return {
            organisation: params.organisation,
            repo: params.repo,
            branch: params.branch,
            model: params.model
        };
    }

    function getModelPath(params) {

        var path = '';

        path += params.organisation + '/';
        path += params.repo + '/';
        path += params.branch + '/';
        path += params.model;

        return path;
    }

    function willMoveModel(params, changes) {
        return changes.model != params.model;
    }
}

module.exports = threatmodellocator;