'use strict';
var repository = require('../repositories/threatmodelrepository');
var threatmodelcontroller = {};

threatmodelcontroller.repos = function (req, res) {
    repository.repos(req.user.profile.username, req.user.accessToken, function (err, repos) {
        if (!err) {
            var responseRepos = [];
            repos.forEach(function (repo, index) {
                responseRepos[index] = repo.full_name;
            });
            res.send(responseRepos);
        } else {
            res.status(500).json(err);
        }
    });
};

threatmodelcontroller.branches = function (req, res){
    
    var repoInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo
    };
    
    repository.branches(repoInfo, req.user.accessToken, function(err, branches) {
        if(!err) {
            var responseBranches = [];
            branches.forEach(function (branch, index) {
                responseBranches[index] = branch.name;
            });
            res.send(responseBranches);
        } else {
            res.status(500).json(err);
        }     
    }); 
};

threatmodelcontroller.models = function (req, res){
    
    var branchInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch
    };
    
    repository.models(branchInfo, req.user.accessToken, function(err, models) {
        if(!err) {
            var responseModels = [];
            models.forEach(function (model, index) {
                responseModels[index] = model.name;
            });
            res.send(responseModels);
        } else {
            res.status(500).json(err);
        }     
    }); 
};
 
threatmodelcontroller.load = function (req, res) {
    var modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model
    };

    repository.load(modelInfo, req.user.accessToken, function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.status(500).json(err);
        }
    });
};
 
module.exports = threatmodelcontroller;