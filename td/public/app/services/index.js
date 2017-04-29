var angular = require('angular');
var app = angular.module('app');
app.factory('datacontext', ['$q', '$http', 'common', 'threatmodellocator', require('./datacontext')]);
app.factory('threatmodellocator', [require('./threatmodellocator')]);