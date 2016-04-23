'use strict';
var httpClient = require('request');

var threatmodelrepository = {};

threatmodelrepository.repos = function (repos_url, accessToken, cb) {
    
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

threatmodelrepository.load = function (model, accessToken, cb) {
    var url = 'https://api.github.com/repos/mike-goodwin/owasp-threat-dragon-demo/git/blobs/5380bfdc38334a44c8358f9cfdd803604a17738e';

    httpClient(getRequestOptions(url, accessToken), function (err, response, body) {

        if (err) {
            cb(err, null);
        }

        if (response.statusCode != 200) {
            cb(new Error(response.body), null);
        } else {
            cb(null, new Buffer(body.content, 'base64'))
        }
    });
};

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

module.exports = threatmodelrepository;