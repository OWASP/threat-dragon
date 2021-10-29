'use strict';

describe('core pager directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var elem;

    beforeEach(function () {

        angular.mock.module('tdCore');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        $scope.previous = function () { };
        spyOn($scope, 'previous');

        $scope.next = function () { };
        spyOn($scope, 'next');

        elem = angular.element('<td-pager previous="previous" next="next" />');
    });

    xit('should invoke previous', function () {
        var testClass = 'testClass';
        setFixtures('<div id="parent" role="dialog"><tmt-modal-close action="action()" new-class="' + testClass + '" template-url="diagrams/modalAccept.html"></tmt-modal-close></div>');
        elem = angular.element($('tmt-modal-close')[0]);
        $compile(elem)($scope);
        $scope.$digest();
        var parent = angular.element($("#parent")[0]);
        ($(elem).find('button')[0]).click();
        expect(parent).toHaveClass(testClass);

    });

    xit('should invoke next', function () {
        var testClass = 'testClass';
        setFixtures('<div id="parent" role="dialog"><tmt-modal-close action="action()" new-class="' + testClass + '" template-url="diagrams/modalAccept.html"></tmt-modal-close></div>');
        elem = angular.element($('tmt-modal-close')[0]);
        $compile(elem)($scope);
        $scope.$digest();
        var parent = angular.element($("#parent")[0]);
        ($(elem).find('button')[0]).click();
        expect(parent).toHaveClass(testClass);

    });
});

