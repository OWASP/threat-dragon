'use strict';

describe('github controller', function () {

    var $scope;
    var $controller;
    var $q;
    var common;
    var $httpBackend;
    var mockLocation;
    var mockRouteParams;
    var mockDatacontext;
    var testPage = 100;

    beforeEach(function () {

        mockDatacontext = {};
        mockRouteParams = {};
        mockLocation = {};
        mockLocation.search = function () {
            return { page: testPage };
        };

        angular.mock.module('app')

        //datacontext mock
        mockDatacontext = {
            repos: function () { return $q.when({ data: null }); }
        };

        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('$location', mockLocation);
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
            var testRepos = 'test repos';
            var testPagination = {
                page: 10
            };

            mockDatacontext.repos = function () {
                return $q.when({ data: { repos: testRepos, pagination: testPagination } });
            };
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

    describe('repos tests', function () {

        it('should set the repos on the vm', function () {

            var testRepos = 'test repos';
            var testPagination = {
                page: 10
            };

            mockDatacontext.repos = function () {
                return $q.when({ data: { repos: testRepos, pagination: testPagination } });
            };

            spyOn(mockDatacontext, 'repos').and.callThrough();

            $controller('github as vm', { $scope: $scope });
            $scope.$apply();
            expect($scope.vm.repos).toEqual(testRepos);
            expect(mockDatacontext.repos.calls.argsFor(0)).toEqual([testPage]);
        });

        it('should not set the repos on the vm', function () {

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

    describe('branches tests', function () {

        it('should set the branches on the vm', function () {

            var testRepo = 'test repo';
            var testOrg = 'test org';
            mockRouteParams.repo = testRepo;
            mockRouteParams.organisation = testOrg;

            var testBranches = 'test branches';
            var testPagination = {
                page: 10
            };

            mockDatacontext.branches = function () {
                return $q.when({ data: { branches: testBranches, pagination: testPagination } });
            };

            spyOn(mockDatacontext, 'branches').and.callThrough();

            $controller('github as vm', { $scope: $scope });
            $scope.$apply();

            expect($scope.vm.branches).toEqual(testBranches);
            expect(mockDatacontext.branches.calls.argsFor(0)).toEqual([testOrg, testRepo, testPage]);

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

    describe('models tests', function () {

        it('should set the models on the vm', function () {

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