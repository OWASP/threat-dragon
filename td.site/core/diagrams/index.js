'use strict';

var core = require('angular').module('tdCore');

var diagramdirectives = require('./diagramdirectives');
var elementPropertyDirectives = require('./elementpropdirectives');
var diagram = require('./diagram');
core.directive('tmtStencil', ['diagramming', diagramdirectives.stencil]);
core.directive('tmtDiagram', ['common', 'diagramming', diagramdirectives.diagram]);
core.directive('tmtModalClose', [elementPropertyDirectives.modalClose]);
core.directive('tmtElementProperties', [elementPropertyDirectives.elementProperties]);
core.directive('tmtElementThreats', ['$routeParams', '$location', 'common', 'dialogs', 'threatengine', elementPropertyDirectives.elementThreats]);
core.controller('diagram', ['$scope', '$document', '$location', '$routeParams', '$timeout', 'dialogs', 'common', 'datacontext', 'threatengine', 'diagramming', 'threatmodellocator', 'hotkeys', diagram]);
