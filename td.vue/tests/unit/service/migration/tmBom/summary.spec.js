import summary from '@/service/migration/tmBom/summary';
import tmBomModel from './husky-ai-threat-model';
import tdModel from './v2-threat-model';

describe('service/migration/tmBom/summary.js', () => {
    let testSummary;

    describe('import TM-BOM scope', () => {
        beforeEach(() => {
            testSummary = summary.read(tmBomModel);
        });

        it('provides summary', () => {
            expect(testSummary.title).toBe(tmBomModel.scope.title);
            expect(testSummary.owner).toBe('');
            expect(testSummary.description).toBe(tmBomModel.scope.description);
            expect(testSummary.id).toBe(0);

        });

        it('stores the compatibility values', () => {
            expect(testSummary.compatibility.business_criticality).toBe(tmBomModel.scope.business_criticality);
            expect(testSummary.compatibility.data_sensitivity).toBe(tmBomModel.scope.data_sensitivity);
            expect(testSummary.compatibility.exposure).toBe(tmBomModel.scope.exposure);
            expect(testSummary.compatibility.tier).toBe(tmBomModel.scope.tier);
        });
    });

    describe('export TM-BOM scope', () => {
	    beforeEach(() => {
	        testSummary = summary.write(tdModel);
            console.debug(JSON.stringify(testSummary));
        });

        it('populates the scope values', () => {
            expect(testSummary.title).toBe(tdModel.summary.title);
            expect(testSummary.description).toBe(tdModel.summary.description);
        });

        it('reinstates the compatibility values to scope', () => {
            expect(testSummary.business_criticality).toBe(tdModel.summary.compatibility.business_criticality);
            expect(testSummary.data_sensitivity).toBe(tdModel.summary.compatibility.data_sensitivity);
            expect(testSummary.exposure).toBe(tdModel.summary.compatibility.exposure);
            expect(testSummary.tier).toBe(tdModel.summary.compatibility.tier);
        });
    });

});
