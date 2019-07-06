'use strict';

var _ = require('lodash');

function threatModelReport($location, $routeParams, threatmodellocator) {

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
        scope.loaded();
        scope.showMitigated = true;
        scope.showOutOfScope = true;
        scope.toggleShowOutOfScope = toggleShowOutOfScope;
        scope.toggleShowMitigated = toggleShowMitigated;
        scope.hasOpenThreats = hasOpenThreats;

        function hasOpenThreats(element) {
            return (element.threats && element.threats.some( function(threat) {
                return threat.status == 'Open';
            }));
        }

        function toggleShowOutOfScope() {
            scope.showOutOfScope = !scope.showOutOfScope;
        }

        function toggleShowMitigated() {
            scope.showMitigated = !scope.showMitigated;
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
    }
}

module.exports = {
    threatModelReport: threatModelReport
};
