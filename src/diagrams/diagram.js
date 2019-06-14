'use strict';

var _ = require('lodash');

function diagram($scope, $location, $routeParams, $timeout, dialogs, common, datacontext, threatengine, diagramming, threatmodellocator) {

    // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
    /*jshint validthis: true */
    var vm = this;
    var controllerId = 'diagram';
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logError = getLogFn(controllerId, 'error');
    var scope = $scope;
    var threatWatchers = [];
    var gridSizeOn = 10;
    var gridSizeOff = 1;

    // Bindable properties and functions are placed on vm.
    vm.errored = false;
    vm.title = 'ThreatModelDiagram';
    vm.initialise = initialise,
        /*jshint -W030 */
        vm.dirty = false;
    vm.graph = diagramming.newGraph();
    vm.newProcess = newProcess;
    vm.newStore = newStore;
    vm.newFlow = newFlow;
    vm.newActor = newActor;
    vm.newBoundary = newBoundary;
    vm.getThreatModelPath = getThreatModelPath;
    vm.select = select;
    vm.edit = edit;
    vm.generateThreats = generateThreats;
    vm.setGrid = setGrid;
    vm.showGrid = false;
    vm.selected = null;
    vm.viewStencil = true;
    vm.viewThreats = false;
    vm.stencils = getStencils();
    vm.zoomIn = zoomIn;
    vm.zoomOut = zoomOut;
    vm.reload = reload;
    vm.save = save;
    //fix, maybe hack (?) for desktop app issue https://github.com/mike-goodwin/owasp-threat-dragon-desktop/issues/43
    //is setting values on parent scope code smell?
    //the reason is that the menu is defined on the shell controller whereas the save needs to be aware of the diagram controller
    if ($scope.$parent.$parent) {
        $scope.$parent.$parent.vm.saveDiagram = vm.save;
    }
    vm.clear = clear;
    vm.currentDiagram = {};
    vm.diagramId = $routeParams.diagramId;
    vm.currentZoomLevel = 0;
    vm.maxZoom = 4;

    //structured exit
    $scope.$on('$locationChangeStart', function (event, current, previous) {
        //suppress structured exit when only search changes
        var absPathCurrent = current.split('?')[0];
        var absPathPrevious = previous.split('?')[0];

        if (vm.dirty && absPathCurrent != absPathPrevious) {
            dialogs.structuredExit(event, function () { }, function () { vm.dirty = false; });
        }
    });

    //element select
    $scope.$on('$locationChangeSuccess', function (event, current, previous) {
        onSelectElement();
    });

    activate();

    function activate() {
        common.activateController([], controllerId)
            .then(function () { log('Activated Threat Model Diagram View'); });
    }

    function getStencils() {

        var shapes = [
            { shape: { getElement: function () { return new diagramming.Process(); }, label: 'Process' }, action: newProcess },
            { shape: { getElement: function () { return new diagramming.Store(); }, label: 'Store' }, action: newStore },
            { shape: { getElement: function () { return new diagramming.Actor(); }, label: 'Actor' }, action: newActor },
            { shape: { getElement: function () { return new diagramming.Flow(); }, label: 'Data Flow' }, action: newFlow },
            { shape: { getElement: function () { return new diagramming.Boundary(); }, label: 'Trust\nBoundary' }, action: newBoundary }];

        return shapes;
    }

    function save() {
        var diagramData = { diagramJson: { cells: vm.graph.getCells() } };

        if (!_.isUndefined(vm.currentDiagram.options) && !_.isUndefined(vm.currentDiagram.options.height) && !_.isUndefined(vm.currentDiagram.options.width)) {
            var size = { height: vm.currentDiagram.options.height, width: vm.currentDiagram.options.width };
            diagramData.size = size;
        }

        datacontext.saveThreatModelDiagram(vm.diagramId, diagramData)
            .then(onSaveDiagram);
    }

    function onSaveDiagram() {
        vm.dirty = false;
        addDirtyEventHandlers();
    }

    function initialise(newDiagram, forceQuery) {
        vm.currentDiagram = newDiagram;
        var threatModelLocation = threatmodellocator.getModelLocation($routeParams);

        datacontext.load(threatModelLocation, forceQuery).then(function (threatModel) {
            onGetThreatModelDiagram(threatModel.detail.diagrams[vm.diagramId]);
        },
            onError);

        function onGetThreatModelDiagram(data) {

            if (!_.isUndefined(data.diagramJson)) {
                vm.graph.initialise(data.diagramJson);
                vm.graph.getCells().forEach(watchThreats);
            }

            if (!_.isUndefined(data.size)) {
                vm.currentDiagram.resize(data.size);
            }

            vm.graph.on('remove', removeElement);
            addDirtyEventHandlers();
            vm.diagram = data;
            vm.dirty = false;

            if ($routeParams.element) {
                var element = vm.graph.getCellById($routeParams.element);
                initialSelect(element);
                //a bit ugly - can we remove the dependency on the diagram?
                vm.currentDiagram.setSelected(element);

                //more ugliness, but $evalAsync does not work!?
                //This is to ensure the stencils are rendered before they are collapsed
                //It is a bit jank though as you see the stencil accordian element collapse :(
                $timeout(function () {
                    vm.viewStencil = false;
                    vm.viewThreats = true;
                });
            }

            vm.loaded = true;
        }
    }

    function reload() {
        //only ask for confirmation if diagram is dirty AND it has some cells
        //avoids the confirmation if you are reloading after an accidental clear of the model
        if (vm.dirty && vm.graph.cellCount() > 0) {
            dialogs.confirm('diagrams/confirmReloadOnDirty.html', function () { vm.initialise(vm.currentDiagram, true); });
        }
        else {
            vm.initialise(vm.currentDiagram, true);
        }
    }

    function clear() {
        vm.graph.clearAll();
    }

    function zoomIn() {
        if (vm.currentZoomLevel < vm.maxZoom) {
            vm.currentZoomLevel++;
            vm.currentDiagram.zoom(vm.currentZoomLevel);
        }
    }

    function zoomOut() {
        if (vm.currentZoomLevel > -vm.maxZoom) {
            vm.currentZoomLevel--;
            vm.currentDiagram.zoom(vm.currentZoomLevel);
        }
    }

    function setGrid() {
        if (vm.showGrid) {
            vm.currentDiagram.setGridSize(gridSizeOn);
            vm.currentDiagram.drawGrid();
        } else {
            vm.currentDiagram.clearGrid();
            vm.currentDiagram.setGridSize(gridSizeOff);
        }
    }

    function onError(error) {
        vm.errored = true;
        logError(error);
    }

    function edit() {
        vm.dirty = true;
    }

    function getThreatModelPath() {
        return threatmodellocator.getModelPathFromRouteParams($routeParams);
    }

    function generateThreats() {
        if (vm.selected) {
            threatengine.generateForElement(vm.selected).then(onGenerateThreats);
        }
    }

    function onGenerateThreats(threats) {
        var threatTotal = threats.length;
        var threatList = threats;
        var currentThreat;
        suggestThreat();

        function suggestThreat() {
            if (threatList.length > 0) {
                currentThreat = threatList.shift();
                dialogs.confirm('diagrams/ThreatEditPane.html',
                    addThreat,
                    function () {
                        return {
                            heading: 'Add this threat?',
                            threat: currentThreat,
                            editing: false,
                            threatIndex: threatTotal - threatList.length,
                            threatTotal: threatTotal
                        };
                    },
                    ignoreThreat,
                    'fade-right'
                );
            }
        }

        function addThreat(applyToAll) {
            vm.dirty = true;

            if (_.isUndefined(vm.selected.threats)) {
                vm.selected.threats = [];
            }

            vm.selected.threats.push(currentThreat);

            if (applyToAll) {
                threatList.forEach(function (threat) {

                    vm.selected.threats.push(threat);
                });
            }
            else {
                $timeout(suggestThreat, 500);
            }
        }

        function ignoreThreat(applyToAll) {
            if (!applyToAll) {
                $timeout(suggestThreat, 500);
            }
        }
    }

    function onSelectElement() {
        var element = null;
        var elementId = $routeParams.element;

        if (elementId) {
            element = vm.graph.getCellById(elementId);
        }

        vm.selected = element;

        //existence test is required to support unit tests where currentDiagram is not initialised
        if (typeof vm.currentDiagram.setSelected === 'function' || typeof vm.currentDiagram.setSelected === 'object') {
            vm.currentDiagram.setSelected(element);
        }
    }

    function initialSelect(element) {
        vm.selected = element;
    }

    function select(element) {
        var elementId = null;

        if (element) {
            elementId = element.id;
        }

        $location.search('element', elementId);
        scope.$apply();
    }

    function removeElement(element, graph, state) {
        vm.dirty = true;
        vm.selected = null;
        unWatchThreats(element);
        $location.search('element', null);
        //scope.$apply cause an exception when clearing all elements (digest already in progress)
        if (!state.clear) {
            scope.$apply();
        }
    }

    function newProcess() {
        return watchThreats(vm.graph.addProcess());
    }

    function newStore() {
        return watchThreats(vm.graph.addStore());
    }

    function newActor() {
        return watchThreats(vm.graph.addActor());
    }

    function newFlow(source, target) {

        return watchThreats(vm.graph.addFlow(source, target));
    }

    function newBoundary() {

        return vm.graph.addBoundary();
    }

    function addDirtyEventHandlers() {

        vm.graph.on('change add', setDirty);

        function setDirty() {
            vm.dirty = true;
            vm.graph.off('change add', setDirty);
            //throws exception (digest already in progress)
            //but removing causes failure to enable save button in diagram editor when moving an element
            //scope.$apply();

        }
    }

    function watchThreats(element) {

        threatWatchers[element.id] = scope.$watch('{ element: "' + element.id + '", threats: vm.graph.getCell("' + element.id + '").threats}', function (newVal) {

            var element = vm.graph.getCell(newVal.element);

            if (newVal.threats) {

                element.hasOpenThreats = newVal.threats.some(function (threat) { return threat.status === 'Open'; });
            }
            else {
                element.hasOpenThreats = false;
            }

        }, true);

        return element;
    }

    function unWatchThreats(element) {

        if (threatWatchers[element.id]) {
            threatWatchers[element.id]();
            threatWatchers.splice(element.id, 1);
        }
    }
}

module.exports = diagram;
