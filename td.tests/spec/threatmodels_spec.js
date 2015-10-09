'use strict';

describe('threatModels controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var mockDatacontext;
    
    beforeEach(function () {
        
        mockDatacontext = {};
        
        angular.mock.module('app')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
        });
        
        angular.mock.inject(function ($rootScope, _$controller_, _$q_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        
        //datacontext mock
        mockDatacontext.getAllThreatModelDetails = function () { return $q.when([{ id: 0 }, { id: 1 }, { id: 2 }])};
        spyOn(mockDatacontext, 'getAllThreatModelDetails').and.callThrough();
        mockDatacontext.deleteThreatModel = function () { return $q.when(null) };
        spyOn(mockDatacontext, 'deleteThreatModel').and.callThrough();
        
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

    });

});