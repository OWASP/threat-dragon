var app = require('angular').module('app');
app.factory('datacontext', ['$q', '$http', 'common', require('./datacontext')]);