var app = require('angular').module('app');
var diagramdirectives = require('./diagramdirectives');
app.directive('tmtStencil', ['diagramming', diagramdirectives.stencil]);
app.directive('tmtDiagram', ['common', 'diagramming', diagramdirectives.diagram]);