'user strict';

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var parsers = function (app) {
   
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());  
    
};

module.exports = parsers;