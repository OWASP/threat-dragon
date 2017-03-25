'use strict';

var app = angular.module('app');
var threatmodel = require('./threatmodel');
app.controller('threatmodel', ['$scope', '$location', '$routeParams', 'dialogs', 'common', 'datacontext', threatmodel]);