var angular= require('angular');
var app = angular.module('app');
var diagram = require('./diagram');
app.controller('diagram', ['$scope', '$location', '$routeParams', '$timeout', 'dialogs', 'common', 'datacontext', 'threatengine', 'diagramming', diagram]);
