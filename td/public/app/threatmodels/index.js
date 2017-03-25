var app = require('angular').module('app');
var github = require('./github');
app.controller('github', ['$q', '$routeParams', '$location', 'common', 'datacontext', github]);
