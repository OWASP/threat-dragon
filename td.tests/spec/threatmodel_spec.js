'use strict';

describe('threatModel controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var mockDatacontext;
    var mockRouteParams;
    var mockLocation;
    var mockDialogs;
    
    beforeEach(function () {
        
        mockDatacontext = {};
        mockRouteParams = {};
        mockLocation = {};
        mockDialogs = {};
        
        angular.mock.module('app')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('$location', mockLocation);
            $provide.value('dialogs', mockDialogs);
        });
        
        angular.mock.inject(function ($rootScope, _$controller_, _$q_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        

    });
    
    describe('initialisation tests', function () {
        
        beforeEach(function () {

            //datacontext mock
            mockDatacontext.getThreatModelDetail = function () { return $q.when('mock threat model') };
            spyOn(mockDatacontext, 'getThreatModelDetail').and.callThrough();
                        
            //routeparams mock
            mockRouteParams.threatModelId = 5;
                       
            $controller('threatmodel as vm', { $scope: $scope });
            $scope.$apply();

        });
        
        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });
        
        it('should have "ThreatModelDetail" for its title', function () {
            expect($scope.vm.title).toEqual('ThreatModelDetail');
        }); 

        it('should call GetThreatModelDetail on the datacontext with parameter 5', function () {

            expect(mockDatacontext.getThreatModelDetail.calls.argsFor(0)).toEqual([5]);

        });

        it('threatmodel should be set to "mock threat model"', function () {
            
            expect($scope.vm.threatModel).toEqual('mock threat model');

        });

        it('should not reload the threat model', function () {
            
            $scope.vm.dirty = true;
            $scope.vm.threatModel = 'original threat model';
            
            //mock dialog - cancel
            mockDialogs.confirm = function (template, onOkPreClose, getParameter, onCancelPreClose) {
                onCancelPreClose();
            }
            
            $scope.vm.reload();
            $scope.$apply();

            expect($scope.vm.threatModel).toEqual('original threat model');
            expect($scope.vm.dirty).toBe(true);

        });
        
        it('should show confirm dialog and reload the threat model', function () {
            
            $scope.vm.dirty = true;
            $scope.vm.threatModel = 'original threat model';
            
            //mock dialog - ok
            mockDialogs.confirm = function (template, onOkPreClose, getParameter, onCancelPreClose) {
                onOkPreClose();
            }
            
            $scope.vm.reload();
            $scope.$apply();
            
            expect($scope.vm.threatModel).toEqual('mock threat model');
            expect($scope.vm.dirty).toBe(false);
        
        });
        
        it('should reload the threat model', function () { 

            $scope.vm.dirty = false;
            $scope.vm.threatModel = 'original threat model';
            
            $scope.vm.reload();
            $scope.$apply();
            
            expect($scope.vm.threatModel).toEqual('mock threat model');
            expect($scope.vm.dirty).toBe(false);

        });

    });

    describe('edit mode tests', function () {
        
        beforeEach(function () {

            //datacontext mock
            mockDatacontext.getThreatModelDetail = function () { return $q.when('mock threat model') };
            spyOn(mockDatacontext, 'getThreatModelDetail').and.callThrough();
            mockDatacontext.saveThreatModel = function () { return $q.when(null) };
            spyOn(mockDatacontext, 'saveThreatModel').and.callThrough();
            mockDatacontext.deleteThreatModel = function () { return $q.when(null) };
            spyOn(mockDatacontext, 'deleteThreatModel').and.callThrough();
            
            //routeparams mock
            mockRouteParams.threatModelId = 'new';
            
            //location mock
            mockLocation.path = function () { };
            spyOn(mockLocation, 'path');
            
            $controller('threatmodel as vm', { $scope: $scope });
            $scope.$apply();

        });
        
        it('should not call GetThreatModelDetail on the datacontext and threat model should be new', function () {
            
            expect(mockDatacontext.getThreatModelDetail.calls.count()).toEqual(0);
            expect($scope.vm.threatModel).toEqual({ summary: {}, detail: { contributors: [], diagrams: [] } });

        });

        it('should call saveThreatModel on the datacontext and navigate to the ThreatModels view', function () {
            
            $scope.vm.threatModel = 'mock threat model';
            $scope.vm.save();
            $scope.$apply();    
            expect(mockLocation.path).toHaveBeenCalledWith('/threatmodels');
            expect(mockDatacontext.saveThreatModel).toHaveBeenCalledWith('mock threat model');

        });

        it('should call deleteThreatModel on the datacontext and navigate to the ThreatModels view', function () {

            $scope.vm.threatModel = 'mock threat model';
            $scope.vm.delete();
            $scope.$apply();
            expect(mockDatacontext.deleteThreatModel).toHaveBeenCalledWith('mock threat model');
            expect(mockLocation.path).toHaveBeenCalledWith('/threatmodels');

        });

        it('should navigate to the specified threat model view', function () {

            $scope.vm.threatModel = { summary: { id: '1' } };
            $scope.vm.cancel();
            expect(mockLocation.path).toHaveBeenCalledWith('/threatmodel/1');

        });

        it('should navigate to the threatmodels view', function () {
            
            $scope.vm.threatModel = { summary: {} };
            $scope.vm.cancel();
            expect(mockLocation.path).toHaveBeenCalledWith('/threatmodels');

        });
        
        it('should add a new contributor', function () {

            $scope.vm.threatModel = { detail: { contributors: [0,1,2] } };
            $scope.vm.addingContributor = true;
            $scope.vm.newContributor = 3;
            $scope.vm.dirty = false;
            $scope.vm.addContributor();

            expect($scope.vm.threatModel.detail.contributors).toEqual([0, 1, 2, { name: 3 }]);
            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.addingContributor).toBe(false);
            expect($scope.vm.newContributor).toEqual('');

        });
        
        it('should remove the specified contributor and set the dirty flag', function () {

            $scope.vm.threatModel = { detail: { contributors: [0, 1, 2] } };
            $scope.vm.dirty = false;
            $scope.vm.removeContributor(1);

            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.threatModel.detail.contributors).toEqual([0, 2]);

        });
        
        it('should set addingContributor', function () {
        
            $scope.vm.startAddingContributor();
            expect($scope.vm.addingContributor).toBe(true);
        
        });

        it('should reset newContributor and addingContributor', function () {
                
            var originalContributor = $scope.vm.newContributor;
            $scope.vm.addingContributor = true;
            $scope.vm.newContributor = "new contributor";
            $scope.vm.cancelAddingContributor();
            expect($scope.vm.addingContributor).toBe(false);
            expect($scope.vm.newContributor).toEqual(originalContributor);

        });
        
        it('should add a new diagram', function () {

            $scope.vm.threatModel = { detail: { diagrams: [{ id: 0, datat: 0 }, { id:  1, data: 1 }, { id: 2, data: 2 }] } };
            $scope.vm.addingDiagram = true;
            $scope.vm.newDiagram = { data: 3 };
            $scope.vm.dirty = false;
            $scope.vm.addDiagram();
            
            expect($scope.vm.threatModel.detail.diagrams).toEqual([{ id: 0, datat: 0 }, { id: 1, data: 1 }, { id: 2, data: 2 }, { id: 3, data: 3 }]);
            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.addingDiagram).toBe(false);
            expect($scope.vm.newDiagram).toEqual($scope.vm.newDiagram);

        });
        
        it('should remove the specified diagram and set the dirty flag', function () {
            
            $scope.vm.threatModel = { detail: { diagrams: [0, 1, 2] } };
            $scope.vm.dirty = false;
            $scope.vm.removeDiagram(1);
            
            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.threatModel.detail.diagrams).toEqual([0, 2]);

        });
        
        it('should set addingDiagram', function () {
            
            $scope.vm.startAddingDiagram();
            expect($scope.vm.addingDiagram).toBe(true);
        
        });

        it('should reset newDiagram and addingDiagram', function () {
            
            var originalDiagram = $scope.vm.newDiagram;
            $scope.vm.addingDiagram = true;
            $scope.vm.cancelAddingDiagram();
            expect($scope.vm.addingDiagram).toBe(false);
            expect($scope.vm.newDiagram).toEqual(originalDiagram);

        });


    });  

});