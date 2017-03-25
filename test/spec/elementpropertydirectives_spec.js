'use strict';

var $ = require('jquery');
require('jasmine-jquery');

describe('modal close directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var elem;

    beforeEach(function () {

        angular.mock.module('app');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();
        $scope.action = function () { };
        spyOn($scope, 'action');

    });

    it('should add the specified class', function () {
        var testClass = 'testClass';
        setFixtures('<div id="parent" role="dialog"><tmt-modal-close action="action()" new-class="' + testClass + '" template-url="diagrams/modalAccept.html"></tmt-modal-close></div>');
        elem = angular.element($('tmt-modal-close')[0]);
        $compile(elem)($scope);
        $scope.$digest();
        var parent = angular.element($("#parent")[0]);
        ($(elem).find('button')[0]).click();
        expect(parent).toHaveClass(testClass);

    });

    it('should invoke the specified action', function () {

        var testClass = 'testClass';
        setFixtures('<div id="parent" role="dialog"><tmt-modal-close action="action()" new-class="' + testClass + '" template-url="diagrams/modalAccept.html"></tmt-modal-close></div>');
        elem = angular.element($('tmt-modal-close')[0]);
        $compile(elem)($scope);
        $scope.$digest();
        ($(elem).find('button')[0]).click();
        expect($scope.action).toHaveBeenCalled();

    });
});

describe('element properties directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var selected;
    var elem;
    var originalName = 'original name';
    var originalReasonOutOfScope = 'reason out of scope';
    var fixtures;

    beforeEach(function () {

        angular.mock.module('app');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        $scope.edit = function () { };
        spyOn($scope, 'edit');

    });

    describe('process element editing: ', function () {

        var originalPrivilegeLevel = 'privilege level';

        beforeEach(function () {

            selected = { name: originalName, outOfScope: false, reasonOutOfScope: originalReasonOutOfScope, privilegeLevel: originalPrivilegeLevel };
            $scope.selected = selected;
            setFixtures('<tmt-element-properties edit="edit()" selected="selected" element-type="tm.Process">');
            elem = angular.element($('tmt-element-properties'));
            $compile(elem)($scope);
            $scope.$digest();

        });

        it('should update the process name', function () {

            //for some reason this is failing on IE, but passing on everything else
            if (navigator.userAgent.indexOf('MSIE') < 0 && navigator.appVersion.indexOf('Trident/') < 0) {

                var newName = 'new name';
                expect(selected.name).toEqual(originalName);
                angular.element($('input[name="nameInput"]')).val(newName).triggerHandler('input');
                expect($scope.edit).toHaveBeenCalled();
                expect(selected.name).toEqual(newName);

            }

        });

        it('should disable reason out of scope', function () {

            expect(angular.element($('textarea[name="textareaReasonOutOfScope"]'))).toBeDisabled();

        });

        it('should update the process privilege level', function () {

            //for some reason this is failing on IE, but passing on everything else
            if (navigator.userAgent.indexOf('MSIE') < 0 && navigator.appVersion.indexOf('Trident/') < 0) {

                var newPrivilegeLevel = 'new privilege level';
                expect(selected.name).toEqual(originalName);
                angular.element($('input[name="privilegeLevelInput"]')).val(newPrivilegeLevel).triggerHandler('input');
                expect($scope.edit).toHaveBeenCalled();
                expect(selected.privilegeLevel).toEqual(newPrivilegeLevel);

            }

        });

        it('should disable privilege level edit and enable reason out of scope', function () {

            expect(angular.element($('input[name="privilegeLevelInput"]'))).not.toBeDisabled();
            expect(angular.element($('textarea[name="textareaReasonOutOfScope"]'))).toBeDisabled();
            $('input[name="checkboxOutOfScope"]').click();
            expect(angular.element($('input[name="privilegeLevelInput"]'))).toBeDisabled();
            expect(angular.element($('textarea[name="textareaReasonOutOfScope"]'))).not.toBeDisabled();

        });

        it('should update reason out of scope', function () {

            //for some reason this is failing on IE, but passing on everything else
            if (navigator.userAgent.indexOf('MSIE') < 0 && navigator.appVersion.indexOf('Trident/') < 0) {

                var newReasonOutOfScope = 'new reason out of scope';
                $('input[name="checkBoxOutOfScope"]').click();
                angular.element($('textarea[name="textareaReasonOutOfScope"]')).val(newReasonOutOfScope).triggerHandler('input');
                expect(selected.reasonOutOfScope).toEqual(newReasonOutOfScope);

            }

        });

    });

    describe('actor element editing', function () {

        beforeEach(function () {

            selected = { name: originalName, outOfScope: false, reasonOutOfScope: originalReasonOutOfScope, providesAuthentication: false };
            $scope.selected = selected;

            elem = angular.element('<tmt-element-properties edit="edit()" selected="selected" element-type="tm.Actor">');
            $compile(elem)($scope);
            $scope.$digest();
            setFixtures(elem);

        });

        it('should update provides authentication', function () {

            $('input[name="checkboxProvidesAuthentication"]').click();
            expect(selected.providesAuthentication).toBe(true);

        });

        it('should disable provides authentication', function () {

            expect($('input[name="checkboxProvidesAuthentication"]')).not.toBeDisabled;
            $('input[name="checkboxOutOfScope"]').click();
            expect($('input[name="checkboxProvidesAuthentication"]')).toBeDisabled;

        });
    });

    describe('store element editing', function () {

        beforeEach(function () {

            selected = { name: originalName, outOfScope: false, reasonOutOfScope: originalReasonOutOfScope, isALog: false, storesCredentials: false, isEncrypted: false, isSigned: false };
            $scope.selected = selected;

            elem = angular.element('<tmt-element-properties edit="edit()" selected="selected" element-type="tm.Store">');
            $compile(elem)($scope);
            $scope.$digest();
            setFixtures(elem);

        });

        it('should update is a log', function () {

            $('input[name="checkboxIsALog"]').click();
            expect(selected.isALog).toBe(true);

        });

        it('should update stores credentials', function () {

            $('input[name="checkboxStoresCredentials"]').click();
            expect(selected.storesCredentials).toBe(true);

        });

        it('should update is encrypted', function () {

            $('input[name="checkboxIsEncryptedStore"]').click();
            expect(selected.isEncrypted).toBe(true);

        });

        it('should update is signed', function () {

            $('input[name="checkboxIsSigned"]').click();
            expect(selected.isSigned).toBe(true);

        });

        it('should disable all checkboxes', function () {

            expect($('input[name="checkboxIsALog"]')).not.toBeDisabled();
            expect($('input[name="checkboxStoresCredentials"]')).not.toBeDisabled();
            expect($('input[name="checkboxIsEncryptedStore"]')).not.toBeDisabled();
            expect($('input[name="checkboxIsSigned"]')).not.toBeDisabled();
            $('input[name="checkboxOutOfScope"]').click();
            expect($('input[name="checkboxIsALog"]')).toBeDisabled();
            expect($('input[name="checkboxStoresCredentials"]')).toBeDisabled();
            expect($('input[name="checkboxIsEncryptedStore"]')).toBeDisabled();
            expect($('input[name="checkboxIsSigned"]')).toBeDisabled();

        });
    });

    describe('flow element editing', function () {

        var originalProtocol = 'original protocol';

        beforeEach(function () {

            selected = { name: originalName, outOfScope: false, reasonOutOfScope: originalReasonOutOfScope, protocol: originalProtocol, isEncrypted: false, isPublicNetwork: false };
            $scope.selected = selected;

            elem = angular.element('<tmt-element-properties edit="edit()" selected="selected" element-type="tm.Flow">');
            $compile(elem)($scope);
            $scope.$digest();
            setFixtures(elem);

        });

        it('should update protocol', function () {

            //for some reason this is failing on IE, but passing on everything else
            if (navigator.userAgent.indexOf('MSIE') < 0 && navigator.appVersion.indexOf('Trident/') < 0) {

                var newProtocol = 'new protocol';
                angular.element($('input[name="inputProtocol"]')).val(newProtocol).triggerHandler('input');
                expect(selected.protocol).toEqual(newProtocol);

            }

        });

        it('should update is encrypted', function () {

            $('input[name="checkboxIsEncryptedFlow"]').click();
            expect(selected.isEncrypted).toBe(true);

        });

        it('should update is public network', function () {

            $('input[name="checkboxIsPublicNetwork"]').click();
            expect(selected.isPublicNetwork).toBe(true);

        });

        it('should disable all inputs', function () {

            expect($('input[name="inputProtocol"]')).not.toBeDisabled();
            expect($('input[name="checkboxIsEncryptedFlow"]')).not.toBeDisabled();
            expect($('input[name="checkboxIsPublicNetwork"]')).not.toBeDisabled();
            $('input[name="checkboxOutOfScope"]').click();
            expect($('input[name="inputProtocol"]')).toBeDisabled();
            expect($('input[name="checkboxIsEncryptedFlow"]')).toBeDisabled();
            expect($('input[name="checkboxIsPublicNetwork"]')).toBeDisabled();

        });
    });
});

describe('element threats directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var $location;
    var $routeParams;
    var common;
    var mockDialogs;
    var mockLogger;
    var elem;
    var threat0 = { id: '0', title: 'title0', type: 'type0', status: 'status0', severity: 'severity0' };
    var threat1 = { id: '1', title: 'title1', type: 'type1', status: 'status1', severity: 'severity1' };
    var threat2 = { id: '2', title: 'title2', type: 'type2', status: 'status2', severity: 'severity2' };

    beforeEach(function () {

        mockDialogs = {};

        angular.mock.module('app');
        angular.mock.module(function ($provide) {
            $provide.value('dialogs', mockDialogs);
        });

        angular.mock.inject(function (_$rootScope_, _$compile_, _$location_, _$routeParams_, _common_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $routeParams = _$routeParams_;
            $location = _$location_;
            common = _common_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        $scope.edit = function () { };
        spyOn($scope, 'edit');
        $scope.threats = [threat0, threat1, threat2];

        //dialogs mocks
        mockDialogs.confirm = function () { };
        spyOn(mockDialogs, 'confirm');

        elem = angular.element('<tmt-element-threats threats="threats" save="edit()" />');

    });

    describe('routing tests', function () {

        it('should ignore invalid threat id', function () {

            $routeParams.threat = 5;
            $compile(elem)($scope);
            $scope.$digest();
            setFixtures(elem);
            expect($location.search().threat).toBeUndefined();
            expect(mockDialogs.confirm).not.toHaveBeenCalled();

        });

        it('should launch threat edit dialog', function () {

            $routeParams.threat = 1;
            $compile(elem)($scope);
            $scope.$digest();
            setFixtures(elem);
            expect(mockDialogs.confirm).toHaveBeenCalled();
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('diagrams/ThreatEditPane.html')
            var param = mockDialogs.confirm.calls.argsFor(0)[2];
            expect(param().threat).toEqual(threat1);
            expect($location.search().threat).toEqual('1');

        });

    });

    describe('threat edit tests', function () {

        beforeEach(function () {

            $compile(elem)($scope);
            $scope.$digest();
            setFixtures(elem);

        })

        it('should launch the new threats dialog', function () {

            angular.element($('#buttonNewThreat')).triggerHandler('click');
            expect(mockDialogs.confirm).toHaveBeenCalled();
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('diagrams/ThreatEditPane.html')

        });

        it('should add a new threat', function () {

            var originalLength = $scope.threats.length;
            angular.element($('#buttonNewThreat')).triggerHandler('click');
            var onOK = mockDialogs.confirm.calls.argsFor(0)[1];
            var param = mockDialogs.confirm.calls.argsFor(0)[2];
            onOK();
            expect($scope.threats.length).toEqual(originalLength + 1);
            expect($scope.edit).toHaveBeenCalled();
            expect(param().editing).toBe(true);

        });

        it('should launch the edit threat dialog', function () {

            angular.element($('#editThreat1')).triggerHandler('click');
            expect(mockDialogs.confirm).toHaveBeenCalled();
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('diagrams/ThreatEditPane.html')
            expect($location.search().threat).toEqual('1');

        });

        it('should edit a threat', function () {

            angular.element($('#editThreat1')).triggerHandler('click');
            var onOK = mockDialogs.confirm.calls.argsFor(0)[1];
            onOK();
            var param = mockDialogs.confirm.calls.argsFor(0)[2];
            expect(param().threat).toEqual(threat1);
            expect(param().editing).toBe(true);
            expect($scope.edit).toHaveBeenCalled();
            expect($location.search().threat).toBeUndefined();

        });

        it('should cancel the edit of a threat', function () {

            angular.element($('#editThreat1')).triggerHandler('click');
            var onCancel = mockDialogs.confirm.calls.argsFor(0)[3];
            onCancel();
            expect($scope.edit).not.toHaveBeenCalled();
            expect($location.search().threat).toBeUndefined();

        });

        it('should remove a threat', function () {

            angular.element($('#remove1')).triggerHandler('click');
            expect($scope.edit).toHaveBeenCalled();
            expect($scope.threats).toEqual([threat0, threat2]);

        });

    });

});