(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('tmtElementSummary', ['common', function (common) {

        var directive =
        {
            link: link,
            templateUrl: './app/report/ElementSummaryPane.html',
            restrict: 'E',
            scope:
            {
                element: '='
            }
        };

        return directive;

        function link(scope, element, attrs)
        {
            var elType = scope.element.attributes.type.split('.')[1];
            scope.element.type = elType;
        }

    }]);

})();


