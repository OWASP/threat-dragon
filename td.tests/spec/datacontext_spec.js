'use strict';

var datacontext;
var $q;
var $rootScope;

describe('datacontext service:', function () {

    beforeEach(function () {

        angular.mock.module('app');
        angular.mock.module('common');

        angular.mock.inject(function (_$rootScope_, _$q_, _$httpBackend_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        //credit for this to http://twofuckingdevelopers.com/2014/07/solving-spyon-problems-in-jasmine/
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || navigator.userAgent.toLowerCase().indexOf('MSIE') > -1 || navigator.appVersion.indexOf('Trident/') > 0) {
            var mock = (function () {
                var store = {};
                return {
                    getItem: function (key) {
                        return store[key];
                    },
                    setItem: function (key, value) {
                        store[key] = value.toString();
                    },
                    removeItem: function(key) {
                        delete store[key];
                    },
                    clear: function () {
                        store = {};
                    }
                };
            })();

            Object.defineProperty(window, 'localStorage', { value: mock, configurable: true, enumerable: true, writable: true });
        }

    });

    it('should return a threat model count of zero', function (done) {

        localStorage.clear();

        angular.mock.inject(function (_datacontext_) {
            datacontext = _datacontext_;
        });

        $rootScope.$apply();

        datacontext.getThreatModelCount().then(function (count) {

            expect(count).toEqual(0);
            done();

        });

        $rootScope.$apply();

    });

    describe('tests:', function () {

        var summary = [];
        var detail = [];
        var model = [];
        var diagram =[];
        var elementProperties = [];
        var threats = [];
        var diagrams;
        var initialModels;

        beforeEach(function () {

            for (var i = 0; i < 4; i++) {

                diagram[i] = { size: 'size' + i, diagramJson: 'diagramJson' + i };
                summary[i] = { id: i, title: 'summary' + i};

            }

            diagrams = [diagram[0], diagram[1], diagram[2]];

            var threatKey = 0;

            for (var i = 0; i < 4; i++) {

                detail[i] = { description: 'desc' + i, diagrams: diagrams };

                threats[i] = [];

                for (var j = 0; j < 3; j++) {

                    threats[i][j] = { id: threatKey, title: 'threat' + i + '-' + j };
                    threatKey++;

                }

                elementProperties[i] = {};

                for (var j = 0; j < 3; j++) {

                    elementProperties[i][i + '-' + j] = { elementId: i + '-' + j, threats: threats[i], threatModelId: i, diagramId: i, prop: 'propValue' }

                }

            }

            for (var i = 0; i < 4; i++) {

                model[i] = { summary: summary[i], detail: detail[i], elementProperties: elementProperties[i] };
            }

            initialModels = [model[0], model[1], model[2]];
            localStorage.setItem('models', JSON.stringify(initialModels));

            angular.mock.inject(function (_datacontext_) {
                datacontext = _datacontext_;
            });

            $rootScope.$apply();

        });

        it('tests localStorage mock', function () {

            localStorage.setItem('testkey', 'testdata');
            expect(localStorage.getItem('testkey')).toEqual('testdata');

        });

        it('should clear local storage and return empty models collection', function (done) {

            spyOn(localStorage, 'removeItem').and.callThrough();
            datacontext.clearStorage().then(function (models) {

                expect(localStorage.removeItem).toHaveBeenCalled();
                expect(localStorage.removeItem.calls.argsFor(0)[0]).toEqual('models');
                expect(models).toEqual([]);
                done();

            });

            $rootScope.$apply();

        });

        it('should count the number of models', function (done) {

            datacontext.getThreatModelCount().then(function (count) {

                expect(count).toEqual(3);
                done();

            });

            $rootScope.$apply();

        });

        it('should get the collection of threat model summaries', function (done) {

            datacontext.getThreatModelSummaries().then(function (summaries) {
                
                expect(summaries).toEqual([summary[0], summary[1], summary[2]] );
                done();

            });

            $rootScope.$apply();

        });

        it('should save a threat model with a new id and return it', function (done) {

            delete model[3].summary.id;
            expect(model[3].summary.id).toBeUndefined();
            datacontext.saveThreatModel(model[3]).then(function (resultModel) {

                expect(resultModel.summary.id).toEqual(3);
                model[3].summary.id = 3;
                initialModels.push(model[3]);
                expect(localStorage.getItem('models')).toEqual(JSON.stringify(initialModels));
                done();

            });

            $rootScope.$apply();

        });

        it('should save a threat model and return it', function (done) {

            model[1].summary.title = 'changedsummary';

            datacontext.saveThreatModel(model[1]).then(function (resultModel) {

                expect(resultModel).toEqual(model[1]);
                expect(localStorage.getItem('models')).toEqual(JSON.stringify([model[0], model[1], model[2]]));
                done();

            });

            $rootScope.$apply();

        });

        it('should delete a threat model and return it', function (done) {

            initialModels.splice(1, 1);

            datacontext.deleteThreatModel(1).then(function (returnModel) {

                expect(returnModel).toEqual(model[1]);
                expect(localStorage.getItem('models')).toEqual(JSON.stringify(initialModels));
                done();

            });

            $rootScope.$apply();

        });

        it('should get all the models', function (done) {

            datacontext.getAllThreatModelDetails().then(function (models) {

                expect(models).toEqual(initialModels);
                done();

            });

            $rootScope.$apply();

        });

        it('should get the requested model', function (done) {

            datacontext.getThreatModelDetail(1).then(function (resultModel) {

                expect(resultModel).toEqual(model[1]);
                done();

            });

            $rootScope.$apply();

        });

        it('should get the requested diagram', function (done) {

            datacontext.getThreatModelDiagram(1, 1).then(function (resultDiagram) {

                expect(resultDiagram).toEqual(diagram[1]);
                done();

            });

            $rootScope.$apply();

        });

        it('should reject invalid model id', function (done) {

            datacontext.getThreatModelDiagram(4, 1).then(function () {

                fail();
                done();

            }, function (message) {

                expect(message).toEqual(jasmine.any(String));
                done();

            });

            $rootScope.$apply();

        });

        it('should reject invalid diagram id', function (done) {

            datacontext.getThreatModelDiagram(1, 4).then(function () {

                fail();
                done();

            }, function (message) {

                expect(message).toEqual(jasmine.any(String));
                done();

            });

            $rootScope.$apply();

        });

        it('should modify a diagram', function (done) {

            datacontext.saveThreatModelDiagram(1, 1, diagram[3]).then(function () {

                var models = JSON.parse(localStorage.getItem('models'));
                expect(models[1].detail.diagrams[1]).toEqual(diagram[3]);
                done();

            });

            $rootScope.$apply();

        });

    });

});