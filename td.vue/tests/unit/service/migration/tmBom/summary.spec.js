import assumptions from '@/service/migration/tmBom/diagrams/assumptions';
import summary from '@/service/migration/tmBom/summary';

import tmBomModel from './test-model';
import tdModel from './v2-threat-model';

jest.mock('@/service/migration/tmBom/diagrams/assumptions');

describe('service/migration/tmBom/summary.js', () => {

    describe('merge TM-BOM', () => {
        let testSummary;
        const testAssumptions = [{validity: 'valid0', description: ''}, {validity: '', description: 'description1'}];

	    describe('creates summary from TM-BOM', () => {
	        beforeEach(() => {
                assumptions.summary.mockReturnValue(testAssumptions);
	            testSummary = summary.merge(tmBomModel);
	        });
	
	        it('provides summary', () => {
	            expect(testSummary.title).toBe(tmBomModel.scope.title);
	            expect(testSummary.owner).toBe('');
	            expect(testSummary.description).toContain(tmBomModel.scope.description);
	            expect(testSummary.id).toBe(0);
	
	        });
	
	        it('adds assumptions', () => {
	            expect(testSummary.description).toContain('valid0');
	            expect(testSummary.description).toContain('#1');
	            expect(testSummary.description).toContain('description1');
	        });
	
	        it('stores the compatibility values', () => {
	            expect(testSummary.compatibility.business_criticality).toBe(tmBomModel.scope.business_criticality);
	            expect(testSummary.compatibility.data_sensitivity).toBe(tmBomModel.scope.data_sensitivity);
	            expect(testSummary.compatibility.exposure).toBe(tmBomModel.scope.exposure);
	            expect(testSummary.compatibility.tier).toBe(tmBomModel.scope.tier);
	        });
        });

	    describe('handles empty TM-BOM objects', () => {
	        it('provides empty scope', () => {
                let noScopeModel = JSON.parse(JSON.stringify(tmBomModel));
                delete noScopeModel.scope;
                testSummary = summary.merge(noScopeModel);
	            expect(testSummary).toStrictEqual({});
	        });

	        it('skips empty assumptions', () => {
                assumptions.summary.mockReturnValue([]);
                testSummary = summary.merge(tmBomModel);
	            expect(testSummary.description).not.toContain('#1');
	        });
	    });
    });

    describe('writes TM-BOM', () => {
        let testScope;

	    describe('recreates TM-BOM scope', () => {
	        beforeEach(() => {
	            testScope = summary.write(tdModel);
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
                let noDescription = JSON.parse(JSON.stringify(tdModel));
                delete noDescription.summary.description;
                testScope = summary.write(noDescription);
	            expect(testScope.description.length).toBeGreaterThan(0);
	        });

	        it('provides scope compatibility defaults', () => {
                let noCompatibility = JSON.parse(JSON.stringify(tdModel));
                delete noCompatibility.summary.compatibility;
                testScope = summary.write(noCompatibility);
                expect(testScope.business_criticality).not.toBeNull();
                expect(testScope.data_sensitivity).not.toBeNull();
                expect(testScope.exposure).not.toBeNull();
                expect(testScope.tier).not.toBeNull();
	        });
	    });
    });

});
