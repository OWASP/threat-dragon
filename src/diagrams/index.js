//requiring angular in the core package causes tried to load angular more than once console warning
//var angular = require('angular');
var app = angular.module('app');
var diagramdirectives = require('./diagramdirectives');
app.directive('tmtStencil', ['diagramming', diagramdirectives.stencil]);
app.directive('tmtDiagram', ['common', 'diagramming', diagramdirectives.diagram]);
