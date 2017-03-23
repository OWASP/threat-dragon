var angular = require('angular');
require('angular-mocks');

var commonModule = angular.module('common', []);
var common = require('../../src/common');
var logger = require('../../src/common/logger');
commonModule.provider('commonConfig', [common.commonConfig]);
commonModule.factory('common', ['$q', '$rootScope', 'commonConfig', 'logger', common.commonModule]);
commonModule.factory('logger', ['$log', logger]);

var app = angular.module('app', ['common']);
var diagramdirectives = require('../../src/diagrams/diagramdirectives');
var diagrammingService = require('../../src/services/diagramming');
app.factory('diagramming', [diagrammingService]);
app.directive('tmtStencil', ['diagramming', diagramdirectives.stencil]);
app.directive('tmtDiagram', ['common', 'diagramming', diagramdirectives.diagram]);

