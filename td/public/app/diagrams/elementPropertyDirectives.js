(function () {
    'use strict';

    var app = angular.module('app');
    
    app.directive('tmtModalClose', [function () {
        
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

    }]);

    app.directive('tmtElementProperties', ['common', function (common) {

        var directive =
        {
            link: link,
            templateUrl: './public/app/diagrams/ElementPropertiesPane.html',
            restrict: 'E',
            scope:
            {
                selected: '=',
                elementType: '@',
                edit: '&'
            }
        };

        return directive;

        function link(scope, element, attrs)
        {
        }

    }]);

    app.directive('tmtElementThreats', ['$routeParams', '$location', 'common', 'dialogs', function ($routeParams, $location, common, dialogs) {

        var directive =
        {
            link: link,
            templateUrl: './public/app/diagrams/ThreatSummaryPane.html',
            restrict: 'E',
            scope:
            {
                threats: '=',
                save: '&'
            }
        };

        var newThreat = initialiseThreat();
        var editIndex = null;
        var originalThreat = {};
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn('tmtElementThreats');
        var logError = getLogFn('tmtElementThreats', 'error');

        return directive;

        function link(scope, element, attrs)
        {
            scope.applyToAll = false;

            scope.onNewThreat = function () {
                dialogs.confirm('./public/app/diagrams/ThreatEditPane.html', scope.addThreat, function () { return { heading: 'New Threat', threat: newThreat, editing: true }; }, reset);
            };

            scope.onEditThreat = function (index) {
                editIndex = index;
                originalThreat = angular.copy(scope.threats[index]);
                $location.search('threat', originalThreat.id);
                dialogs.confirm('./public/app/diagrams/ThreatEditPane.html', scope.editThreat, function () { return { heading: 'Edit Threat', threat: scope.threats[index], editing: true }; }, scope.cancelEdit);
            };

            scope.removeThreat = function (index) {
                scope.threats.splice(index, 1);
                scope.save();
            };

            scope.addThreat = function () {
                
                if (!scope.threats)
                {
                    scope.threats = [];
                }
                
                scope.threats.push(newThreat);
                scope.save({ threat: newThreat });
                reset();
            };

            scope.editThreat = function () {
                scope.save();
                reset();
            };

            scope.cancelEdit = function () {
                scope.threats[editIndex] = originalThreat;
                reset();
            };

            var threatId = $routeParams.threat;

            if (angular.isDefined(threatId))
            {
                var matchingIndex = -1;

                scope.threats.forEach(function (threat, index) {
                    if (threat.id == threatId) {
                        matchingIndex = index;
                    }
                });

                if (matchingIndex >= 0)
                {
                    scope.onEditThreat(matchingIndex);
                }
                else
                {
                    logError('Invalid threat ID');
                    $location.search('threat', null);
                }
            }
        }

        function reset()
        {
            newThreat = initialiseThreat();
            editIndex = null;
            $location.search('threat', null);
        }

        function initialiseThreat()
        {
            return { status: 'Open', severity: 'Medium' };
        }

    }]);

})();


