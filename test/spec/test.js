var angular = require('angular');
require('angular-mocks');
require('angular-route');
require('../../src/templates');
var app = angular.module('app', ['common', 'ui.bootstrap', 'ngRoute', 'templates']);
require('../../src/index');