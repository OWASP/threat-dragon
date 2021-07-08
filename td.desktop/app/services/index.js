var angular = require('angular');
var app = angular.module('app');
app.factory('electron', ['common', require('./electron')]);
app.factory('datacontext', ['$q', 'electron', require('./datacontext')]);
app.factory('threatmodellocator', [require('./threatmodellocator')]);
