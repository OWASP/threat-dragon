'use strict';
var repository = require('../repositories/threatmodelrepository');
var threatmodelcontroller = {};

threatmodelcontroller.repos = function (req, res) {
    repository.repos(req.user.profile.repos_url, req.user.accessToken, function (err, repos) {
        if (!err) {
            
            var sessionRepos = [];
            var responseRepos = [];
            repos.forEach(function(repo, index) {
                responseRepos[index] = repo.full_name;
                sessionRepos[index] = {
                    branches_url: repo.branches_url,
                    full_name: repo.full_name
                };
            });
            
            req.session.repos = sessionRepos;
            res.send(responseRepos);

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
        threatModel: req.params.threatModel
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