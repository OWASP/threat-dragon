'use strict';

var _ = require('lodash');

function threatModelReport($location, $routeParams, threatmodellocator, diagramming) {

    var directive =
        {
            link: link,
            templateUrl: 'threatmodels/threatmodelreport.html',
            restrict: 'E',
            scope:
            {
                model: '=',
                loaded: '&',
                save: '&?',
                print: '&?'
            }
        };

    return directive;

    function link(scope, element, attrs) {
        
        scope.printable = _.isFunction(scope.print);
        scope.saveable = _.isFunction(scope.save);
        scope.savePDF = savePDF;
        scope.printPDF = printPDF;
        scope.cancel = cancel;
        scope.isPrintingOrSaving = false;
        scope.showMitigated = true;
        scope.showOutOfScope = true;
        scope.showDiagrams = false;
        scope.toggleShowOutOfScope = toggleShowOutOfScope;
        scope.toggleShowMitigated = toggleShowMitigated;
        scope.toggleShowDiagrams = toggleShowDiagrams;
        scope.initialise = initialise;
        scope.graphs = null;

        primeGraphs();
        scope.loaded();

        function initialise(diagram) {
            initialiseGraphs();
            diagram.removeTools();
            diagram.scaleContentToFit();
        }

        function toggleShowOutOfScope() {
            scope.showOutOfScope = !scope.showOutOfScope;
        }

        function toggleShowMitigated() {
            scope.showMitigated = !scope.showMitigated;
        }

        function toggleShowDiagrams() {
            scope.showDiagrams = !scope.showDiagrams;
        }

        function savePDF() {
            scope.isPrintingOrSaving = true;
            scope.save({done: done});
        }

        function printPDF() {
            scope.isPrintingOrSaving = true;
            scope.print({done: done});
        }

        function done() {
            scope.isPrintingOrSaving = false;
            scope.safeApply();
        }

        function cancel() {
            if (!_.isUndefined(scope.model.summary.title)) {
                $location.path('/threatmodel/' + threatmodellocator.getModelPathFromRouteParams($routeParams));
            }
            else {
                $location.path('/');
            }
        }

        scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
              if(fn && (typeof(fn) === 'function')) {
                fn();
              }
            } else {
              this.$apply(fn);
            }
        };

        function initialiseGraphs() {

            scope.model.detail.diagrams.forEach(initialiseGraph);

            function initialiseGraph(diagram) {
                scope.graphs[diagram.id].initialise(diagram.diagramJson);
            }
        }

        function primeGraphs() {
            //cant see how to initialise with the right number of diagrams
            //so arbitrarily pick 20
            scope.graphs = [];

            for (var i = 0; i < 20; i++) {    
                scope.graphs[i] = diagramming.newGraph();
              }
        }
    }
}

module.exports = {
    threatModelReport: threatModelReport
};
