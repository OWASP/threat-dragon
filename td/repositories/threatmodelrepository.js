'use strict';
var fs = require('fs');
var path = require('path');

var threatmodelrepository = {};

threatmodelrepository.load = function(model, accessToken, cb) {
   fs.readFile(path.join(__dirname, '../public/Demo_Threat_Model.json'), cb);
}

module.exports = threatmodelrepository;