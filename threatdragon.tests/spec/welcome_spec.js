'use strict';

describe('welcome controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var mockDatacontext;
    var mockDialogs;
    var getThreatModelCountSpy;
    
    beforeEach(function () {
        
        mockDatacontext = {};
        mockDialogs = {};
        
        angular.mock.module('app')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('dialogs', mockDialogs);
        });
        
        angular.mock.inject(function ($rootScope, _$controller_, _$q_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        
        //datacontgext mock
        mockDatacontext.getThreatModelCount = function () { };
        getThreatModelCountSpy = spyOn(mockDatacontext, 'getThreatModelCount').and.returnValue($q.when(9));
        mockDatacontext.clearStorage = function () { };
        spyOn(mockDatacontext, 'clearStorage').and.returnValue($q.when(null));

        $controller('welcome as vm', { $scope: $scope });
        $scope.$apply();
    });
    
    describe('initilisation tests', function () {

        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });
        
        it('should have "Welcome" for its title', function () {
            expect($scope.vm.title).toEqual('Welcome');
        });

        it('should call getThreatModelCount on the datacontext and the count should be 9', function () {  

            expect(mockDatacontext.getThreatModelCount).toHaveBeenCalled();
            expect($scope.vm.threatModelCount).toEqual(9);

        });

    });

    describe('viewmodel tests', function () {

        it('should call clearStorage on the datacontext and reset threatModelCount', function () {
            
            //mock dialog - OK
            mockDialogs.confirm = function (template, onOkPreClose, getParameter, onCancelPreClose)
            {
                onOkPreClose();
            }
            
            $scope.vm.threatModelCount = 10;
            $scope.vm.clearLocalStorage();
            $scope.$apply();

            expect(mockDatacontext.clearStorage).toHaveBeenCalled();
            expect(mockDatacontext.getThreatModelCount.calls.count()).toEqual(2);
            expect($scope.vm.threatModelCount).toEqual(9);
        });

    });

    describe('viewmodel tests', function () {
        
        it('should not call clearStorage on the datacontext and threatModelCount should be unchanged', function () {
            
            //mock dialog - cancel
            mockDialogs.confirm = function (template, onOkPreClose, getParameter, onCancelPreClose) {
                onCancelPreClose();
            }
            
            $scope.vm.threatModelCount = 10;
            
            $scope.vm.clearLocalStorage();
            $scope.$apply();
            
            expect(mockDatacontext.clearStorage).not.toHaveBeenCalled();
            expect(mockDatacontext.getThreatModelCount.calls.count()).toEqual(1);
            expect($scope.vm.threatModelCount).toEqual(10);

        });

    });

});