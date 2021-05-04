'use strict';

var pager = function() {

    var directive = {
        templateUrl: 'layout/pager.html',
        link: link,
        restrict: 'E',
        scope: {
            canPrevious: '=',
            canNext: '=',
            page: '=',
            items: '=',
            next: '&',
            previous: '&',
            select: '&'
        }
    };

    return directive;

    function link(scope, element, attrs) {
    }

};

module.exports = pager;