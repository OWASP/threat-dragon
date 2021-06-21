'use strict';

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

function elementThreats($routeParams, $location, common, dialogs) {

    var directive =
        {
            link: link,
            templateUrl: 'diagrams/ThreatSummaryPane.html',
            restrict: 'E',
            scope:
            {
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

        scope.onSuggestThreats = function () {
            scope.suggest(scope.type);
        };

        scope.onNewThreat = function () {
            newThreat = initialiseThreat(scope.type);
            dialogs.confirm(getTemplate(newThreat.modelType), scope.addThreat, function () { return { heading: 'New Threat', threat: newThreat, editing: true }; }, scope.cancelAdd);
        };

        scope.onEditThreat = function (index) {
            var threat = scope.threats[index];
            editIndex = index;
            originalThreat = angular.copy(scope.threats[index]);
            $location.search('threat', originalThreat.id);
            dialogs.confirm(getTemplate(threat.modelType), scope.editThreat, function () { return { heading: 'Edit Threat', threat: threat, editing: true }; }, scope.cancelEdit);
        };

        scope.removeThreat = function (index) {
            scope.threats.splice(index, 1);
            scope.save();
            scope.setdirty();
        };

        scope.addThreat = function () {

            if (!scope.threats) {
                scope.threats = [];
            }

            scope.threats.push(newThreat);
            scope.save({ threat: newThreat });
            scope.setdirty();
            reset(scope.type);
        };

        scope.cancelAdd = function () {
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

        var threatId = $routeParams.threat;

        if (angular.isDefined(threatId)) {
            var matchingIndex = -1;

            scope.threats.forEach(function (threat, index) {
                if (threat.id == threatId) {
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

    function getTemplate(type) {
        var template;
        if (type == null) {
            template = 'diagrams/StrideEditPane.html';
        } else if (type == 'CIA') {
            template = 'diagrams/CiaEditPane.html';
        } else if (type == 'LINDDUN') {
            template = 'diagrams/LinddunEditPane.html';
        } else {
            template = 'diagrams/StrideEditPane.html';
        }
        return template;
    }

}

module.exports = {
    modalClose: modalClose,
    elementProperties: elementProperties,
    elementThreats: elementThreats
};
