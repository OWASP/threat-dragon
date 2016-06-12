var app = require('angular').module('app');
app.factory('routemediator', ['$rootScope', '$location', 'config', 'logger', require('./routemediator')]);
app.factory('threatengine', ['$q', require('./threatengine')]);