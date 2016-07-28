var app = require('angular').module('app');
var diagramdirectives = require('./diagramdirectives');
app.directive('tmtStencil', ['common', diagramdirectives.stencil]);
app.directive('tmtDiagram', ['common', diagramdirectives.diagram]);