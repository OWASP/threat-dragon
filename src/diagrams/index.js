//requiring angular in the core package causes tried to load angular more than once console warning
//var angular = require('angular');
var app = angular.module('app');
var diagramdirectives = require('./diagramdirectives');
var elementPropertyDirectives = require('./elementpropdirectives');
app.directive('tmtStencil', ['diagramming', diagramdirectives.stencil]);
app.directive('tmtDiagram', ['common', 'diagramming', diagramdirectives.diagram]);
app.directive('tmtModalClose', [elementPropertyDirectives.modalClose]);
app.directive('tmtElementProperties', [elementPropertyDirectives.elementProperties]);
app.directive('tmtElementThreats', ['$routeParams', '$location', 'common', 'dialogs', elementPropertyDirectives.elementThreats]);
