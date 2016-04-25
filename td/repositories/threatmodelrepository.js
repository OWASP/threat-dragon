'use strict';
var httpClient = require('request');
var url_base = 'https://api.github.com/';
var threatmodelrepository = {};

threatmodelrepository.repos = function (organisation, accessToken, cb) {
    
    var repos_url = url_base + 'users/' + organisation + '/repos';
    
    httpClient(getRequestOptions(repos_url, accessToken), function(err, response, body) {
        
        if(err) {
            cb(err, null);
        }
        
        if (response.statusCode != 200 ) {
            cb(new Error(response.body), null);
        } else {
            cb(null, body);
        }   
    });
};

threatmodelrepository.branches = function (repoInfo, accessToken, cb) {
    
    var branches_url = url_base + 'repos/' + repoInfo.organisation + '/' + repoInfo.repo + '/branches';
    
    httpClient(getRequestOptions(branches_url, accessToken), function(err, response, body) {
        
        if(err) {
            cb(err, null);
        }
        
        if (response.statusCode != 200 ) {
            cb(new Error(response.body), null);
        } else {
            cb(null, body);
        }   
    });
};

threatmodelrepository.models = function (branchInfo, accessToken, cb) {
    
    var models_url = url_base + 'repos/' + branchInfo.organisation + '/' + branchInfo.repo + '/contents/ThreatDragonModels?ref=' + branchInfo.branch;
    
    httpClient(getRequestOptions(models_url, accessToken), function(err, response, body) {
        
        if(err) {
            cb(err, null);
        }
        
        if (response.statusCode != 200 ) {
            cb(new Error(response.body), null);
        } else {
            cb(null, body)
        }   
    });
};

threatmodelrepository.load = function (modelInfo, accessToken, cb) {
    
    'https://raw.githubusercontent.com/mike-goodwin/owasp-threat-dragon-demo/master/ThreatDragonModels/Demo_Threat_Model_0/Demo_Threat_Model_0.json'
    
    var model_url =  'https://raw.githubusercontent.com/' + modelInfo.organisation;
    model_url += '/' + modelInfo.repo;
    model_url += '/' + modelInfo.branch;
    model_url += '/ThreatDragonModels/' + modelInfo.model;
    model_url += '/' + modelInfo.model + '.json';
    
    httpClient(getRequestOptions(model_url, accessToken), function (err, response, body) {

        if (err) {
            cb(err, null);
        }

        if (response.statusCode != 200) {
            cb(new Error(response.body), null);
        } else {
            cb(null, body)
        }
    });
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

function getBranchUrl(branchName, branches) {
    var branch_url;
    var branch = branches.find(function(branch) {
        return branch.name === branchName;
    });
    
    if (branch && branch.commit) {
        branch_url = branch.commit.url;
    }
    
    return branch_url
}

module.exports = threatmodelrepository;