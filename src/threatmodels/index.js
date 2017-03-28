'use strict';

var core = angular.module('owasp-threat-dragon-core');
var threatmodel = require('./threatmodel');
core.controller('threatmodel', ['$scope', '$location', '$routeParams', 'dialogs', 'common', 'datacontext', threatmodel]);