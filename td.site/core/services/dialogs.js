'use strict';

function dialogs($location, $modal) {

    var service = {
        confirm: confirm,
        structuredExit: structuredExit,
        dialogTemplate: template
    };

    function structuredExit(event, cancelNavigation, continueNavigation) {

        var modal = $modal.open({
            templateUrl: 'layout/structuredExit.html',
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
    
    function template(type) {
        var template;
        if (type == null) {
            // use STRIDE for backward compatibility with models where no type given
            template = 'diagrams/StrideEditPane.html';
        } else if (type == 'CIA') {
            template = 'diagrams/CiaEditPane.html';
        } else if (type == 'LINDDUN') {
            template = 'diagrams/LinddunEditPane.html';
        } else if (type == 'STRIDE') {
            template = 'diagrams/StrideEditPane.html';
        } else {
            // if not recognised then default to STRIDE
            template = 'diagrams/StrideEditPane.html';
        }
        return template;
    }

    return service;
}

module.exports = dialogs;