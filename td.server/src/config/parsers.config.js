'use strict';

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var parsers = function (app) {
   
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());  
    
};

var exports = {
    config: parsers
};

module.exports = exports;
