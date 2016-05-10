'use strict';

describe('github controller', function () {

    var $scope;
    var $controller;
    var $q;
    var common;
    var $httpBackend;
    var mockRouteParams;
    var mockDatacontext;
    var mockDialogs;

    beforeEach(function () {

        mockDatacontext = {};
        mockRouteParams = {};
        mockDialogs = {};

        angular.mock.module('app')
        
        //datacontext mock
        mockDatacontext = {
            repos: function() { return $q.when( {data: null} );}
        };

        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('dialogs', mockDialogs);
        });

        angular.mock.inject(function ($rootScope, _$controller_, _$q_, _$httpBackend_, _common_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            common = _common_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        
    });

    describe('initialisation tests', function () {

        beforeEach(function () {
            $controller('github as vm', { $scope: $scope });
            $scope.$apply();
        });

        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });

        it('should have "Load From GitHub" for its title', function () {
            expect($scope.vm.title).toEqual('Load From GitHub');
        });

    });
    
    describe('repos tests', function() {
        
        it('should set the repos on the vm', function() {
            
            var testRepos = 'test repos';
            
            mockDatacontext.repos = function () { 
                return $q.when({ data: testRepos });
            };  
                  
            $controller('github as vm', { $scope: $scope });
            $scope.$apply();  
            expect($scope.vm.repos).toEqual(testRepos);       
        });
        
        it('should not set the repos on the vm', function() {
            
            var testError = new Error('test error');
            
            mockDatacontext.repos = function () { 
                return $q.reject(testError);
            };  
            
            var errorLogger = jasmine.createSpy('errorLogger');
            spyOn(common.logger, 'getLogFn').and.returnValue(errorLogger);
            $controller('github as vm', { $scope: $scope });
            $scope.$apply();  
            expect($scope.vm.repos).toEqual([]);
            expect($scope.vm.error).toEqual(testError);
            expect(errorLogger.calls.argsFor(0)).toEqual([testError]);      
        });
    });
    
    describe('branches tests', function() {
        
        it('should set the branches on the vm', function() {
            
            var testRepo = 'test repo';
            var testOrg = 'test org';
            mockRouteParams.repo = testRepo;
            mockRouteParams.organisation = testOrg;
            
            var testBranches = 'test branches';

            mockDatacontext.branches = function () {
                return $q.when({ data: testBranches });
            };
            
            spyOn(mockDatacontext, 'branches').and.callThrough();
            
            $controller('github as vm', { $scope: $scope });
            $scope.$apply();  
            
            expect($scope.vm.branches).toEqual(testBranches);
            expect(mockDatacontext.branches.calls.argsFor(0)).toEqual([testOrg, testRepo]);             
            
        });

        it('should not set the branches on the vm', function () {
            
            var testRepo = 'test repo';
            var testOrg = 'test org';
            mockRouteParams.repo = testRepo;
            mockRouteParams.organisation = testOrg;

            var testError = new Error('test error');

            mockDatacontext.branches = function () {
                return $q.reject(testError);
            };

            var errorLogger = jasmine.createSpy('errorLogger');
            spyOn(common.logger, 'getLogFn').and.returnValue(errorLogger);
            $controller('github as vm', { $scope: $scope });
            $scope.$apply();
            expect($scope.vm.branches).toEqual([]);
            expect($scope.vm.error).toEqual(testError);
            expect(errorLogger.calls.argsFor(0)).toEqual([testError]);
        });
    });
    
    describe('models tests', function() {
        
        it('should set the models on the vm', function() {
            
            var testRepo = 'test repo';
            var testOrg = 'test org';
            var testBranch = 'test branch';
            mockRouteParams.repo = testRepo;
            mockRouteParams.organisation = testOrg;
            mockRouteParams.branch = testBranch;
            
            var testModels = 'test models';

            mockDatacontext.models = function () {
                return $q.when({ data: testModels });
            };
            
            spyOn(mockDatacontext, 'models').and.callThrough();
            
            $controller('github as vm', { $scope: $scope });
            $scope.$apply();  
            
            expect($scope.vm.models).toEqual(testModels);
            expect(mockDatacontext.models.calls.argsFor(0)).toEqual([testOrg, testRepo, testBranch]);             
            
        });

        it('should not set the models on the vm', function () {
            
            var testRepo = 'test repo';
            var testOrg = 'test org';
            var testBranch = 'test branch';
            mockRouteParams.repo = testRepo;
            mockRouteParams.organisation = testOrg;
            mockRouteParams.branch = testBranch;

            var testError = new Error('test error');

            mockDatacontext.models = function () {
                return $q.reject(testError);
            };

            var errorLogger = jasmine.createSpy('errorLogger');
            spyOn(common.logger, 'getLogFn').and.returnValue(errorLogger);
            $controller('github as vm', { $scope: $scope });
            $scope.$apply();
            expect($scope.vm.models).toEqual([]);
            expect($scope.vm.error).toEqual(testError);
            expect(errorLogger.calls.argsFor(0)).toEqual([testError]);
        });
    });
});