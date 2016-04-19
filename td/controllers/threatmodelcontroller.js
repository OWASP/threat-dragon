'use strict';
var repository = require('../repositories/threatmodelrepository');
var threatmodelcontroller = {};
 
threatmodelcontroller.load =  function(req, res) {
    var modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        threatModel: req.params.threatModel
    }
    
    res.sendFile(require('path').resolve('td/public/Demo_Threat_Model.json'), {headers: {'Content-Type': 'application/json'}});
    
    // repository.load(modelInfo, req.user.profile.accessToken, function(err, data) {
    //     if(!err) {
    //         res.json(data.toString('utf8'));
    //     } else {
    //         res.status(500).json(err);
    //     }
    // });
}
 
 module.exports = threatmodelcontroller;