'use strict';

function threatModelReport() {

    var directive =
        {
            link: link,
            templateUrl: 'threatmodels/threatmodelreport.html',
            restrict: 'E',
            scope:
            {
                loaded: '&'
            }
        };

    return directive;

    function link(scope, element, attrs) {
        scope.loaded();
    }

}

module.exports = {
    threatModelReport: threatModelReport
};
