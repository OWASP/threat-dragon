'use strict';

function threatModelReport() {

    var directive =
        {
            link: link,
            templateUrl: 'threatmodels/threatmodelreport.html',
            restrict: 'E',
            scope:
            {
                model: '=',
                loaded: '&',
                save: '&'
            }
        };

    return directive;

    function link(scope, element, attrs) {
        scope.generatePDF = generatePDF;
        scope.isPrinting = false;
        scope.loaded();

        function generatePDF() {
            scope.isPrinting = true;
            scope.save({done: done});

            function done() {
                scope.isPrinting = false;
                scope.$apply();
            }
        }
    }
}

module.exports = {
    threatModelReport: threatModelReport
};
