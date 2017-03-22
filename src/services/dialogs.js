'use strict';

function dialogs($location, $modal) {

    var service = {
        confirm: confirm,
        structuredExit: structuredExit
    };

    function structuredExit(event, cancelNavigation, continueNavigation) {

        var modal = $modal.open({
            templateUrl: './public/app/layout/structuredExit.html',
            controller: 'structuredExitController',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                destination: function () { return $location.path(); },
                cancel: function () { return cancelNavigation; },
                ok: function () { return continueNavigation; }
            }
        });

        event.preventDefault();

        return modal.result;
    }

    function confirm(template, onOkPreClose, getParameter, onCancelPreClose, windowClass) {

        var options = {
            templateUrl: template,
            controller: 'confirmController',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                ok: function () { return onOkPreClose; },
                cancel: function () { return onCancelPreClose; },
                parameter: function () { return getParameter; }
            }
        };

        if (windowClass) {

            options.windowClass = windowClass;

        }

        var modal = $modal.open(options);

        return modal.result;
    }
    
    return service;
}

module.exports = dialogs;