'use strict';
//requiring angular in the core package causes tried to load angular more than once console warning
//var angular = require('angular');
var commonModule = angular.module('common', []);

commonModule.provider('commonConfig', [require('./common').commonConfig]);
commonModule.factory('common', ['$q', '$rootScope', 'commonConfig', 'logger', require('./common').commonModule]);
commonModule.factory('logger', ['$log', require('./logger')]);