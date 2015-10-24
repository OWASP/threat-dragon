'use strict';

describe('file read directive: ', function () {

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
        
        $scope.labelText = 'labelText';
        $scope.action = function (content) { console.log(content) ;};
        spyOn($scope, 'action').and.callThrough();

        elem = angular.element('<tmt-file-read-string action="action()" label-text="{{labelText}}">');
        $compile(elem)($scope);
        $scope.$digest();
        setFixtures(elem);

    });
    
    it('should set the label text of the element', function() {
        
        expect($(elem)).toContainText($scope.labelText);        
        
    });
    
    it('should create a file reader input', function() {
        
        expect($(elem)).toContainElement('input[type="file"]');        
        
    });
    
    it('should read file content and pass it to the scope action', function() {
        
        //how to test this? 
        //cannot set the fileSelect.files property since it is read only (in IE and FF)
        //may need to refactorthe directive...   
        
    });
});
