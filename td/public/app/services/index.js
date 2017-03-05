var app = require('angular').module('app');
app.factory('routemediator', ['$rootScope', '$location', 'config', 'logger', require('./routemediator')]);
app.factory('datacontext', ['$q', '$http', 'common', require('./datacontext')]);
app.factory('threatengine', [require('./threatengine')]);