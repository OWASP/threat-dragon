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
                    clear: function () {
                        store = {};
                    }
                };
            })();

            Object.defineProperty(window, 'localStorage', { value: mock, configurable: true, enumerable: true, writable: true });
        }

    });

    describe('tests:', function () {

        var summary = [];
        var detail = [];
        var model = [];
        var diagram =[];
        var elementProperties = [];
        var diagrams;
        var initialModels;

        beforeEach(function () {

            for (var i = 0; i < 4; i++) {

                diagram[i] = { size: 'size' + i, diagramJson: 'diagramJson' + i };
                summary[i] = { id: i, title: 'summary' + i};

            }

            diagrams = [diagram[0], diagram[1], diagram[2]];

            for (var i = 0; i < 4; i++) {

                detail[i] = { description: 'desc' + i, diagrams: diagrams };
                elementProperties[i] = ['properties' + i + '0', 'properties' + i + '1', 'properties' + i + '2'];

            }

            for (var i = 0; i < 4; i++) {

                model[i] = { summary: summary[i], detail: detail[i], elementProperties: elementProperties[i] };
            }

            initialModels = [model[0], model[1], model[2]];
            localStorage.setItem('models', JSON.stringify(initialModels));


            //diagram0 = { size: 'size0', diagramJson: 'diagramJson0' };
            //diagram1 = { size: 'size1', diagramJson: 'diagramJson1' };
            //diagram2 = { size: 'size2', diagramJson: 'diagramJson2' };
            //diagram3 = { size: 'size3', diagramJson: 'diagramJson3' };
            //diagrams = [diagram0, diagram1, diagram2];
            //summary0 = { id: 0, title: 'summary0' };
            //summary1 = { id: 1, title: 'summary1' };
            //summary2 = { id: 2, title: 'summary2' };
            //summary3 = { id: 2, title: 'summary3' }; //spare
            //detail0 = { description: 'desc0', diagrams: diagrams };
            //detail1 = { description: 'desc1', diagrams: diagrams };
            //detail2 = { description: 'desc2', diagrams: diagrams };
            //detail3 = { description: 'desc3', diagrams: diagrams }; //spare
            //elementProperties0 = ['properties00', 'properties01', 'properties02'];
            //elementProperties1 = ['properties10', 'properties11', 'properties12'];
            //elementProperties2 = ['properties20', 'properties21', 'properties22'];
            //elementProperties3 = ['properties30', 'properties31', 'properties32'];
            //model0 = { summary: summary0, detail: detail0, elementProperties: elementProperties0 };
            //model1 = { summary: summary1, detail: detail1, elementProperties: elementProperties1 };
            //model2 = { summary: summary2, detail: detail2, elementProperties: elementProperties2 };
            //model3 = { summary: summary3, detail: detail3, elementProperties: elementProperties3 }; //spare
            //initialModels = [model0, model1, model2]; //dont add the spare
            //localStorage.setItem('models', JSON.stringify(initialModels));

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

            spyOn(localStorage, 'clear').and.callThrough();
            datacontext.clearStorage().then(function (models) {

                expect(localStorage.clear).toHaveBeenCalled();
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

            datacontext.deleteThreatModel(model[1]).then(function (returnModel) {

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

        it('should get the specified element properties', function (done) {

            datacontext.getElementProperties(1, 1, 1).then(function (properties) {

                expect(properties).toEqual('properties11');
                done();

            });

            $rootScope.$apply();

        });

        it('should update the element properties', function (done) {

            done();

        });


        it('should delete the specified element properties and return them', function (done) {

            datacontext.deleteElementProperties(1, 1, 1).then(function (properties) {

                var models = JSON.parse(localStorage.getItem('models'));
                expect(properties).toEqual('properties11');
                expect(models[1].elementProperties).toEqual(['properties10',null, 'properties12']);
                done();

            });

            $rootScope.$apply();

        });

    });

});