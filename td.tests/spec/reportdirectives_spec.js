'use strict';

describe('element summary directive: ', function() {
    
    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var elem;
    
    beforeEach(function() {
      
        angular.mock.module('app');
        angular.mock.module('./app/report/ElementSummaryPane.html');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();  
        
    });
    
    it('should set the isolate scope element type', function() {
        
		var elementType = 'ElementType';
        $scope.element = {attributes: {type: 'prefix.' + elementType}};
        
        elem = angular.element('<tmt-element-summary element="element">');
        $compile(elem)($scope);
        $scope.$digest();
        setFixtures(elem);
		
		var isolateScope = elem.scope();
		expect(isolateScope.element.type).toEqual(elementType);
       
    });  
});