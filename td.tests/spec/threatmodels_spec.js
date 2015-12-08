'use strict';

describe('threatModels controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var $location;
    var mockDatacontext;
    var mockWebDatacontext;
    var mockFileService;
    
    beforeEach(function () {
        
        mockDatacontext = {};
        mockWebDatacontext = {};
        mockFileService = {};
        
        angular.mock.module('app')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('webdatacontext', mockWebDatacontext);
            $provide.value('file', mockFileService);
        });
        
        angular.mock.inject(function ($rootScope, _$controller_, _$q_, _$httpBackend_, _$location_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            $location = _$location_
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        
        //datacontext mock
        mockDatacontext.getAllThreatModelDetails = function () { return $q.when([{ id: 0 }, { id: 1 }, { id: 2 }]);};
        spyOn(mockDatacontext, 'getAllThreatModelDetails').and.callThrough();
        mockDatacontext.deleteThreatModel = function () { return $q.when(null); };
        spyOn(mockDatacontext, 'deleteThreatModel').and.callThrough();
        mockDatacontext.saveThreatModel = function() { return $q.when(null); };
        spyOn(mockDatacontext, 'saveThreatModel').and.callThrough();

        //file service mock
        mockFileService.saveToFile = function () { };
        spyOn(mockFileService, 'saveToFile');
        
        $controller('threatmodels as vm', { $scope: $scope });
        $scope.$apply();
    });
    
    describe('initialisation tests', function () {
        
        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });
        
        it('should have "ThreatModels" for its title', function () {
            expect($scope.vm.title).toEqual('ThreatModels');
        });
        
        it('should call getThreatModels on the datacontext and the count should be 3', function () {
            
            expect(mockDatacontext.getAllThreatModelDetails).toHaveBeenCalled();
            expect($scope.vm.threatModels.length).toEqual(3);

        });

    });

    describe('viewmodel tests', function () {
        
        it('should call deleteThreatModel on the datacontext and remove the specified threat model', function () {
            
            expect($scope.vm.threatModels.length).toEqual(3);
            $scope.vm.deleteThreatModel(1);
            $scope.$apply();
            expect(mockDatacontext.deleteThreatModel).toHaveBeenCalled();
            expect($scope.vm.threatModels[0].id).toEqual(0);
            expect($scope.vm.threatModels[1].id).toEqual(2);
            expect($scope.vm.threatModels.length).toEqual(2);
        });
        
        it('should call saveToFile on the file service', function () {

            var threatModels = [{ summary: { title: 'model0' } }, { summary: { title: 'model1' } }, { summary: { title: 'model2' } }];
            var index = 1;
            var content = JSON.stringify(threatModels[index]);
            $scope.vm.threatModels = threatModels;

            $scope.vm.saveThreatModelToFile(index);
            expect(mockFileService.saveToFile).toHaveBeenCalled();
            expect(mockFileService.saveToFile.calls.argsFor(0)).toEqual([threatModels[index].summary.title.replace(' ', '_') + '.dragon', content, 'application/json']);

        });

        it('should delete the threat model id and save', function () {

            var threatModel = { summary: { id: 1, title: 'model'} };
            var content = JSON.stringify(threatModel);
            delete threatModel.summary.id;

            $scope.vm.loadThreatModelFromFile(content);
            expect(mockDatacontext.saveThreatModel).toHaveBeenCalled();
            expect(mockDatacontext.saveThreatModel.calls.argsFor(0)).toEqual([threatModel]);

        });
        
        it('should get the demo model from the webdatacontext and save it', function() {
            
            var demoModel = {summary: { id: 1, title: 'demo model'}};
            mockWebDatacontext.getDemoModel = function() { return $q.when({data: demoModel}) };
            spyOn(mockWebDatacontext, 'getDemoModel').and.callThrough();
            
            $scope.vm.loadDemoModel();
            $scope.$apply();
            expect(mockWebDatacontext.getDemoModel).toHaveBeenCalled();
            expect(mockDatacontext.saveThreatModel).toHaveBeenCalled();
            expect(mockDatacontext.saveThreatModel.calls.argsFor(0)).toEqual([demoModel]);
            
        })
        
        it('should error when loading the demo model', function() {
            
            var error = {status: 500, statusText: 'Internal server error'};
            mockWebDatacontext.getDemoModel = function() { return $q.reject(error) };
            spyOn(mockWebDatacontext, 'getDemoModel').and.callThrough();
            
            $scope.vm.loadDemoModel();
            $scope.$apply();
            expect(mockWebDatacontext.getDemoModel).toHaveBeenCalled();
            expect(mockDatacontext.saveThreatModel).not.toHaveBeenCalled();
 
        })
        
        it('should add a new diagram and edit it', function(){
            
            spyOn($location, 'path');
            var threatModel = {summary: {id: 1, title: 'model'}, detail: {diagrams: ['diagram 1', 'diagram 2']}};
            var diagramCount = threatModel.detail.diagrams.length;
            $scope.vm.threatModels = [ threatModel ];
            $scope.vm.addNewDiagram(0);
            $scope.$apply();
            
            expect(mockDatacontext.saveThreatModel).toHaveBeenCalled();
            expect(threatModel.detail.diagrams.length).toEqual(diagramCount + 1);
            expect($location.path).toHaveBeenCalled();
            expect($location.path.calls.argsFor(0)).toEqual(['threatmodel/'+ threatModel.summary.id + '/diagram/' + diagramCount]);
        })

    });

});