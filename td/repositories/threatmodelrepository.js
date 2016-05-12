'use strict';
var github = require('octonode');
var threatmodelrepository = {};

threatmodelrepository.repos = function (page, accessToken, cb) {

    var client = github.client(accessToken);
    client.me().repos(page, cb);
};

threatmodelrepository.branches = function (repoInfo, accessToken, cb) {

    var client = github.client(accessToken);
    client.repo(getRepoFullName(repoInfo)).branches(repoInfo.page, 30, cb);
};

threatmodelrepository.models = function (branchInfo, accessToken, cb) {

    var client = github.client(accessToken);
    client.repo(getRepoFullName(branchInfo)).contents('ThreatDragonModels', branchInfo.branch, cb);
};

threatmodelrepository.model = function (modelInfo, accessToken, cb) {

    var path = getModelPath(modelInfo);
    var client = github.client(accessToken);
    client.repo(getRepoFullName(modelInfo)).contents(path, modelInfo.branch, cb);
};

threatmodelrepository.create = function (modelInfo, accessToken, cb) {

    var path = getModelPath(modelInfo);
    var client = github.client(accessToken);
    var message = 'Created by OWASP Threat Dragon';
    var content = getModelContent(modelInfo);
    client.repo(getRepoFullName(modelInfo)).createContents(path, message, content, modelInfo.branch, cb);
};

threatmodelrepository.update = function (modelInfo, accessToken, cb) {

    threatmodelrepository.model(modelInfo, accessToken, function (err, content) {

        if (err) {
            cb(err, null);
        } else {
            var path = getModelPath(modelInfo);
            var client = github.client(accessToken);
            var message = 'Updated by OWASP Threat Dragon';
            var newContent = getModelContent(modelInfo);
            client.repo(getRepoFullName(modelInfo)).updateContents(path, message, newContent, content.sha, modelInfo.branch, cb);
        }
    });
};

threatmodelrepository.deleteModel = function (modelInfo, accessToken, cb) {

    threatmodelrepository.model(modelInfo, accessToken, function (err, content) {

        if (err) {
            cb(err, null);
        } else {
            var path = getModelPath(modelInfo);
            var client = github.client(accessToken);
            var message = 'Deleted by OWASP Threat Dragon';
            client.repo(getRepoFullName(modelInfo)).deleteContents(path, message, content.sha, modelInfo.branch, cb);
        }
    });
};


//private functions

function getRepoFullName(info) {
    return info.organisation + '/' + info.repo;
}

function getModelPath(modelInfo) {
    return 'ThreatDragonModels/' + modelInfo.model + '/' + modelInfo.model + '.json';
}

function getModelContent(modelInfo) {
    return JSON.stringify(modelInfo.body, null, '  ');
}

module.exports = threatmodelrepository;