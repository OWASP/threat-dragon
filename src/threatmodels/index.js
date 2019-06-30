'use strict';

var core = angular.module('owasp-threat-dragon-core');
var threatmodel = require('./threatmodel');
var threatModelDirectives = require('./threatmodeldirectives');

core.directive('tmtThreatModelReport', ['$location', '$routeParams', 'threatmodellocator', threatModelDirectives.threatModelReport]);
core.controller('threatmodel', ['$scope', '$location', '$routeParams', 'dialogs', 'common', 'datacontext', 'threatmodellocator', threatmodel]);