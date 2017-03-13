var angular= require('angular');
var app = angular.module('app');
var diagramdirectives = require('./diagramdirectives');
var elementPropertyDirectives = require('./elementpropertydirectives');
var diagram = require('./diagram');

app.directive('tmtStencil', ['diagramming', diagramdirectives.stencil]);
app.directive('tmtDiagram', ['common', 'diagramming', diagramdirectives.diagram]);
app.directive('tmtModalClose', [elementPropertyDirectives.modalClose]);
app.directive('tmtElementProperties', [elementPropertyDirectives.elementProperties]);
app.directive('tmtElementThreats', ['$routeParams', '$location', 'common', 'dialogs', elementPropertyDirectives.elementThreats]);
angular.module('app').controller('diagram', ['$scope', '$location', '$routeParams', '$timeout', 'dialogs', 'common', 'datacontext', 'threatengine', 'diagramming', diagram]);
