import scope from '@/service/migration/tmBom/scope';
import tdModel from './td-test-model';

jest.mock('@/service/migration/tmBom/diagrams/assumptions');

describe('service/migration/tmBom/scope.js', () => {

    describe('convert TM-BOM', () => {
        let testScope;

	    describe('recreates TM-BOM scope', () => {
	        beforeEach(() => {
	            testScope = scope.convert(tdModel);
	        });
	
	        it('populates the scope values', () => {
	            expect(testScope.title).toBe(tdModel.summary.title);
	            expect(testScope.description).toBe(tdModel.summary.description);
	        });
	
	        it('reinstates the compatibility values to scope', () => {
	            expect(testScope.business_criticality).toBe(tdModel.summary.compatibility.business_criticality);
	            expect(testScope.data_sensitivity).toBe(tdModel.summary.compatibility.data_sensitivity);
	            expect(testScope.exposure).toBe(tdModel.summary.compatibility.exposure);
	            expect(testScope.tier).toBe(tdModel.summary.compatibility.tier);
	        });
	    });

	    describe('provides TM-BOM scope defaults', () => {
	        it('creates default scope values', () => {
                const noDescription = JSON.parse(JSON.stringify(tdModel));
                delete noDescription.summary.description;
                testScope = scope.convert(noDescription);
	            expect(testScope.description.length).toBeGreaterThan(1);
	        });

	        it('provides scope compatibility defaults', () => {
                const noCompatibility = JSON.parse(JSON.stringify(tdModel));
                delete noCompatibility.summary.compatibility;
                testScope = scope.convert(noCompatibility);
                expect(testScope.business_criticality.length).toBeGreaterThan(1);
                expect(testScope.data_sensitivity[0].length).toBeGreaterThan(1);
                expect(testScope.exposure.length).toBeGreaterThan(1);
                expect(testScope.tier.length).toBeGreaterThan(1);
	        });
	    });
    });

});
