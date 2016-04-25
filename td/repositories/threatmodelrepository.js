'use strict';
var httpClient = require('request');
var url_base = 'https://api.github.com/';
var threatmodelrepository = {};

threatmodelrepository.repos = function (organisation, accessToken, cb) {
    
    var repos_url = url_base + 'users/';
    repos_url += organisation + '/repos';
    executeRequest(getRequestOptions(repos_url, accessToken), cb);
};

threatmodelrepository.branches = function (repoInfo, accessToken, cb) {
    
    var branches_url = url_base + 'repos/';
    branches_url += repoInfo.organisation + '/';
    branches_url += repoInfo.repo + '/branches';
    executeRequest(getRequestOptions(branches_url, accessToken), cb);
};

threatmodelrepository.models = function (branchInfo, accessToken, cb) {
    
    var models_url = url_base + 'repos/' + branchInfo.organisation;
    models_url += '/' + branchInfo.repo;
    models_url += '/contents/ThreatDragonModels?ref=' + branchInfo.branch;
    executeRequest(getRequestOptions(models_url, accessToken), cb);
};

threatmodelrepository.model = function (modelInfo, accessToken, cb) {
    
    var model_url =  'https://raw.githubusercontent.com/' + modelInfo.organisation;
    model_url += '/' + modelInfo.repo;
    model_url += '/' + modelInfo.branch;
    model_url += '/ThreatDragonModels/' + modelInfo.model;
    model_url += '/' + modelInfo.model + '.json';
    
    executeRequest(getRequestOptions(model_url, accessToken), cb);
};

//private functions
function getRequestOptions(url, accessToken) {
    
    var authHeader = 'token ' + accessToken;
    
    return {
        url: url,
        json: true,
        headers: {
            'Authorization': authHeader,
            'User-Agent': 'OWASP-Threat-Dragon'
        }
    };
};

function executeRequest(requestOptions, cb) {

    httpClient(requestOptions, function (err, response, body) {

        if (err) {
            cb(err, { statusCode: 500 });
        }

        if (response.statusCode != 200) {
            cb(new Error(response.body), { statusCode: response.statusCode });
        } else {
            cb(null, body)
        }
    });
}

module.exports = threatmodelrepository;