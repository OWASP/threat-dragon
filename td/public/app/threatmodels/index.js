var app = require('angular').module('app');
var github = require('./github');
var webreport = require('./webreport');
app.controller('github', ['$q', '$routeParams', '$location', 'common', 'datacontext', github]);
app.controller('webreport', ['$timeout', '$routeParams', 'common', 'datacontext', 'threatmodellocator', webreport]);
