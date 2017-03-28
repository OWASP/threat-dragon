var angular = require('angular');
require('angular-mocks');
require('angular-route');
require('../../src/templates');
var core = angular.module('owasp-threat-dragon-core', ['common', 'ui.bootstrap', 'ngRoute', 'templates']);
require('../../src/index');