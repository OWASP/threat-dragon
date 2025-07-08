import summary from '@/service/migration/tmBom/summary';
import tmBomModel from './test-model';
import tdModel from './v2-threat-model';

describe('service/migration/tmBom/summary.js', () => {
    let testSummary, testScope;

    describe('import TM-BOM scope', () => {
        beforeEach(() => {
            testSummary = summary.read(tmBomModel);
        });

        it('provides summary', () => {
            expect(testSummary.title).toBe(tmBomModel.scope.title);
            expect(testSummary.owner).toBe('');
            expect(testSummary.description).toContain(tmBomModel.scope.description);
            expect(testSummary.id).toBe(0);

        });

        it('adds assumptions', () => {
            expect(testSummary.description).toContain(tmBomModel.assumptions[0].validity);
            expect(testSummary.description).toContain('#1');
            expect(testSummary.description).toContain(tmBomModel.assumptions[0].description);
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

});
