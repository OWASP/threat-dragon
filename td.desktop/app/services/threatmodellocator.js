'use strict';

function threatmodellocator() {

    var service = {
        getModelLocation: getModelLocation,
        getModelPath: getModelPath,
        getModelPathFromRouteParams: getModelPathFromRouteParams,
        willMoveModel: willMoveModel,
        newModelLocation: '/threatmodel/new'
    };

    return service;

    //gets a file path from a base64 encoded value
    //repeatedely decode until it looks like an unencoded value
    //ignore demo
    function getModelLocation(params) {

        var result = params.location;

        if (result != 'demo') {
            while (checkEncoded(result)) {
                result = atob(result);
            }
        }

        return result;
    }

    //gets a url path from a file path
    //base64 encode it unless it already looks encoded
    //ignore demo
    function getModelPath(location) {

        var result = location;

        if (result != 'demo') {
            if (!checkEncoded(result)) {
                result = btoa(result);
            }
        }

        return result;
    }

    function getModelPathFromRouteParams(params) {
        return getModelPath(params.location);
    }

    function willMoveModel() {
        return false;
    }

    function checkEncoded(value) {
        var pattern = /\\|\//i;
        return !pattern.test(value);
    }
}

module.exports = threatmodellocator;
