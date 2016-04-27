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
    
    var file_url = url_base + 'repos/' + modelInfo.organisation;
    file_url += '/' + modelInfo.repo;
    file_url += '/contents/ThreatDragonModels/' + modelInfo.model;
    file_url += '/' + modelInfo.model + '.json';
    file_url += '?ref=' + modelInfo.branch;
    
    executeRequest(getRequestOptions(file_url, accessToken), cb);
};

threatmodelrepository.create = function(modelInfo, accessToken, cb) {
    var create_url = url_base + 'repos/' + modelInfo.organisation;
    create_url += '/' + modelInfo.repo;
    create_url += '/contents/ThreatDragonModels/' + modelInfo.model;
    create_url += '/' + modelInfo.model + '.json';
    
    var body = {
        message: "new model test",
        content: (new Buffer(JSON.stringify(modelInfo.body, null, '  '))).toString('base64'),
        branch: modelInfo.branch
    };
    
    executeRequest(putRequestOptions(create_url, accessToken, body), cb);
};

threatmodelrepository.update = function(modelInfo, accessToken, cb) {
    
    var file_url = url_base + 'repos/' + modelInfo.organisation;
    file_url += '/' + modelInfo.repo;
    file_url += '/contents/ThreatDragonModels/' + modelInfo.model;
    file_url += '/' + modelInfo.model + '.json';
    file_url += '?ref=' + modelInfo.branch;
    
    executeRequest(getRequestOptions(file_url, accessToken), function(err, result) {
        if(err) {
            cb(err, null);
        } else {
            
            var update_url = url_base + 'repos/' + modelInfo.organisation;
            update_url += '/' + modelInfo.repo;
            update_url += '/contents/ThreatDragonModels/' + modelInfo.model;
            update_url += '/' + modelInfo.model + '.json';

            var body = {
                message: "update model test",
                content: (new Buffer(JSON.stringify(modelInfo.body, null, '  '))).toString('base64'),
                branch: modelInfo.branch,
                sha: result.sha
            };
            
            executeRequest(putRequestOptions(update_url, accessToken, body), cb);
        }
    });
};

//private functions
function getRequestOptions(url, accessToken) {
    
    var options = baseOptions(url, accessToken);
    options.json = true;
    return options;
};

function putRequestOptions(url, accessToken, body) {
    
    var options = baseOptions(url, accessToken);
    options.method = 'PUT';
    options.body = JSON.stringify(body);
        
    return options;
}

function baseOptions(url, accessToken) {
    
    var authHeader = 'token ' + accessToken;
    
    return {
        url: url,
        headers: {
            'Authorization': authHeader,
            'User-Agent': 'OWASP-Threat-Dragon'
        }
    };    
}

function executeRequest(requestOptions, cb) {

    httpClient(requestOptions, function (err, response, body) {

        if (err) {
            cb(err, { statusCode: 500 });
        }

        if (response.statusCode != 200 && response.statusCode != 201) {
            cb(new Error(response.body), { statusCode: response.statusCode });
        } else {
            cb(null, body)
        }
    });
}

module.exports = threatmodelrepository;