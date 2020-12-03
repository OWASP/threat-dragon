'use strict';
var repository = require('../repositories/threatmodelrepository');
var threatmodelcontroller : any = {};

threatmodelcontroller.repos = function (req, res) {
    
    var page = req.query.page || 1;
    repository.repos(page, req.user.accessToken, function (err, repos, headers) {
        if (!err) {
            var responseRepos = [];
            repos.forEach(function (repo, index) {
                responseRepos[index] = repo.full_name;
            });
            res.send({repos: responseRepos, pagination: getPagination(headers, page)});
        } else {
            res.status(err.statusCode || 500).json(err);
        }
    });
};

threatmodelcontroller.branches = function (req, res){
    
    var repoInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        page: req.query.page || 1
    };
    
    repository.branches(repoInfo, req.user.accessToken, function(err, branches, headers) {
        if(!err) {
            var responseBranches = [];
            branches.forEach(function (branch, index) {
                responseBranches[index] = branch.name;
            });
            res.send({branches: responseBranches, pagination: getPagination(headers, repoInfo.page)});
        } else {
            res.status(err.statusCode || 500).json(err);
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
            res.status(err.statusCode || 500).json(err);
        }     
    }); 
};
 
threatmodelcontroller.model = function (req, res) {
    var modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model
    };

    repository.model(modelInfo, req.user.accessToken, function (err, data) {
        if (!err) {
            var model= (new Buffer(data.content, 'base64')).toString();
            res.send(model);
        } else {
            res.status(err.statusCode || 500).json(err);
        }
    });
};

threatmodelcontroller.create = function(req, res) {
    var modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,
        body: req.body        
    };
    
    repository.create(modelInfo, req.user.accessToken, function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.status(err.statusCode || 500).json(err);
        }        
    }); 
};

threatmodelcontroller.update = function(req, res) {
    var modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,
        body: req.body        
    };
    
    repository.update(modelInfo, req.user.accessToken, function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.status(err.statusCode || 500).json(err);
        }        
    }); 
};

threatmodelcontroller.deleteModel = function(req, res) {
    var modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,      
    };
    
    repository.deleteModel(modelInfo, req.user.accessToken, function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.status(err.statusCode || 500).json(err);
        }        
    }); 
};

//private methods
function getPagination(headers, page) {
    
    var pagination = { page: page, next: false, prev: false };
    var linkHeader = headers.link;
    
    if(linkHeader) {
        
        linkHeader.split(',').forEach(function(link) {
           if (isLinkType('"next"')) {
               pagination.next = true;
           }
           
           if (isLinkType('"prev"')) {
               pagination.prev = true;
           }
           
           function isLinkType(type) {
               return link.split(';')[1].split('=')[1] === type;
           }
        });
    }
    
    return pagination;  
}
 
module.exports = threatmodelcontroller;