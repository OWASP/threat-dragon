var angular = require('angular');
var app = angular.module('app');
app.factory('datacontextdemo', ['$q', '$http', require('./datacontextdemo')]);
app.factory('electron', ['common', require('./electron')]);
app.factory('datacontext', ['$q', 'datacontextdemo', 'electron', require('./datacontext')]);
app.factory('threatmodellocator', [require('./threatmodellocator')]);
