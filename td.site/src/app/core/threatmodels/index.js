'use strict';

var core = angular.module('tdCore');
var threatmodel = require('./threatmodel');
var threatModelDirectives = require('./threatmodeldirectives');

core.directive('tmtThreatModelReport', ['$location', '$routeParams', 'threatmodellocator', 'diagramming', threatModelDirectives.threatModelReport]);
core.controller('threatmodel', ['$scope', '$location', '$routeParams', 'dialogs', 'common', 'datacontext', 'threatmodellocator', threatmodel]);