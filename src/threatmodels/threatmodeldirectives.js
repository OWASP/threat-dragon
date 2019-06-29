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
                loaded: '&'
            }
        };

    return directive;

    function link(scope, element, attrs) {
        console.log(scope.model);
        scope.loaded();
    }

}

module.exports = {
    threatModelReport: threatModelReport
};
