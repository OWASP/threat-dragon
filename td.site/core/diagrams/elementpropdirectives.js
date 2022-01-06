'use strict';
const uuidv4 = require('uuid/v4');

var angular = require('angular');
var $ = require('jquery');

function modalClose() {

    var directive =
        {
            link: link,
            templateUrl: function (elem, attrs) { return attrs.templateUrl; },
            restrict: 'E',
            scope:
            {
                action: '&',
                newClass: '@',
            }
        };

    return directive;

    function link(scope, element, attrs) {

        scope.onAction = function () {

            var el = $("[role='dialog']");
            var windowClass = el.attr("window-class");
            el.removeClass(windowClass);
            el.addClass(scope.newClass);
            scope.action();
        };
    }

}

function elementProperties(common) {

    var directive =
        {
            link: link,
            templateUrl: 'diagrams/ElementPropertiesPane.html',
            restrict: 'E',
            scope:
            {
                selected: '=',
                elementType: '@',
                edit: '&'
            }
        };

    return directive;

    function link(scope, element, attrs) {
    }

}

function elementThreats($routeParams, $location, common, dialogs, threatengine) {

    var directive =
        {
            link: link,
            templateUrl: 'diagrams/ThreatSummaryPane.html',
            restrict: 'E',
            scope:
            {
                context: '=',
                suggest: '=',
                threats: '=',
                type: '=',
                save: '&',
                setdirty: '=',
            }
        };

    var newThreat;
    var editIndex = null;
    var originalThreat = {};
    var getLogFn = common.logger.getLogFn;
    var logError = getLogFn('tmtElementThreats', 'error');

    return directive;

    function link(scope, element, attrs) {
        scope.applyToAll = false;

        scope.onNewThreat = function () {
            newThreat = initialiseThreat(scope.type);
            dialogs.confirm(
                dialogs.dialogTemplate(newThreat.modelType),
                scope.addNewThreat,
                function () {
                    return {
                        heading: 'New Threat',
                        threat: newThreat,
                        editing: true
                    };
                },
                scope.cancelNewThreat
            );
        };

        scope.onThreatsPerElement = function () {
            scope.suggest(scope.type);
        };

        scope.onThreatsByContext = function () {
            scope.context(scope.type);
        };

        scope.onEditThreat = function (index) {
            var threat = scope.threats[index];
            editIndex = index;
            originalThreat = angular.copy(scope.threats[index]);
            $location.search('threat', originalThreat.id);
            if (!threat.threatId) {
                threat.threatId = uuidv4();
            }
            dialogs.confirm(
                dialogs.dialogTemplate(threat.modelType),
                scope.editThreat,
                function () {
                    return {
                        heading: 'Edit Threat',
                        threat: threat,
                        editing: true
                    };
                },
                scope.cancelEdit
            );
        };

        scope.removeThreat = function (index) {
            scope.threats.splice(index, 1);
            scope.save();
            scope.setdirty();
        };

        scope.addNewThreat = function () {

            if (!scope.threats) {
                scope.threats = [];
            }

            newThreat.threatId = uuidv4();
            scope.threats.push(newThreat);
            scope.save({ threat: newThreat });
            scope.setdirty();
            reset(scope.type);
        };

        scope.cancelNewThreat = function () {
            reset(scope.type);
        };

        scope.editThreat = function () {
            scope.save();
            scope.setdirty();
            reset(scope.type);
        };

        scope.cancelEdit = function () {
            scope.threats[editIndex] = originalThreat;
            reset(scope.type);
        };

        var threatIndex = $routeParams.threat;

        if (angular.isDefined(threatIndex)) {
            var matchingIndex = -1;

            scope.threats.forEach(function (threat, index) {
                if (threat.id == threatIndex) {
                    matchingIndex = index;
                }
            });

            if (matchingIndex >= 0) {
                scope.onEditThreat(matchingIndex);
            }
            else {
                logError('Invalid threat ID');
                $location.search('threat', null);
            }
        }
    }

    function reset(modelType) {
        newThreat = initialiseThreat(modelType);
        editIndex = null;
        $location.search('threat', null);
    }

    function initialiseThreat(modelType) {
        if (modelType == null){
            return { status: 'Open', severity: 'Medium', modelType: 'UNDEFINED' };
        }
        return { status: 'Open', severity: 'Medium', modelType: modelType };
    }

}

module.exports = {
    modalClose: modalClose,
    elementProperties: elementProperties,
    elementThreats: elementThreats
};
