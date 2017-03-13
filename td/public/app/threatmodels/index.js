var app = require('angular').module('app');
app.controller('github', ['$q', '$routeParams', '$location', 'common', 'datacontext', require('./github')]);
app.controller('threatmodel', ['$scope', '$location', '$routeParams', 'dialogs', 'common', 'datacontext', require('./threatmodel')]);