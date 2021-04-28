'use strict';

describe('threatmodellocator service:', function () {

    var threatmodellocator;
    var $rootScope;
    var $httpBackend;

    beforeEach(function () {

        angular.mock.module('app');

        angular.mock.inject(function (_$rootScope_, _$httpBackend_, _threatmodellocator_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
            threatmodellocator = _threatmodellocator_;
        });

        $rootScope.$apply();
    });

    it('should return the new model location', function () {
        expect(threatmodellocator.newModelLocation).toEqual('/new/threatmodel');
    });

    it('should return a model location object', function () {

        var organisation = 'organisation';
        var repo = 'repo';
        var branch = 'branch';
        var model = 'model';

        var params = {
            organisation: organisation,
            repo: repo,
            branch: branch,
            model: model
        }

        var location = threatmodellocator.getModelLocation(params);

        expect(location.organisation).toEqual(organisation);
        expect(location.repo).toEqual(repo);
        expect(location.branch).toEqual(branch);
        expect(location.model).toEqual(model);
    });

    it('should return a model path', function () {

        var organisation = 'organisation';
        var repo = 'repo';
        var branch = 'branch';
        var model = 'model';

        var params = {
            organisation: organisation,
            repo: repo,
            branch: branch,
            model: model
        }

        var path = 'organisation/repo/branch/model'
        expect(threatmodellocator.getModelPath(params)).toEqual(path);
    });

        it('should return a model path based on the route params', function () {

        var organisation = 'organisation';
        var repo = 'repo';
        var branch = 'branch';
        var model = 'model';

        var params = {
            organisation: organisation,
            repo: repo,
            branch: branch,
            model: model
        }

        var path = 'organisation/repo/branch/model'
        expect(threatmodellocator.getModelPathFromRouteParams(params)).toEqual(path);
    });

    it('should move the model', function () {

        var organisation = 'organisation';
        var repo = 'repo';
        var branch = 'branch';
        var model = 'model';

        var params = {
            organisation: organisation,
            repo: repo,
            branch: branch,
            model: model
        };

        expect(threatmodellocator.willMoveModel(params, { model: 'new model' })).toBe(true);
    });

    it('should not move the model', function () {

        var organisation = 'organisation';
        var repo = 'repo';
        var branch = 'branch';
        var model = 'model';

        var params = {
            organisation: organisation,
            repo: repo,
            branch: branch,
            model: model
        };

        var changes = {
            organisation: organisation + 'x',
            repo: repo + 'x',
            branch: branch + 'x',
            model: model
        };

        expect(threatmodellocator.willMoveModel(params, changes)).toBe(false);
    });
});
