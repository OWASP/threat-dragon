import diagrams from '@/service/migration/tmBom/diagrams';
import tmBomModel from './husky-ai-threat-model';

describe('service/migration/tmBom/diagrams.js', () => {
    let testDiagrams;
    const version = 'x.y.zz';

    describe('import TM-BOM diagrams', () => {
        beforeEach(() => {
            testDiagrams = diagrams.read(tmBomModel, version);
        });

        it('versions the first diagram', () => {
            expect(testDiagrams[0].version).toBe(version);
        });

        it('provides the first diagram', () => {
		    expect(testDiagrams[0].title).toBe(tmBomModel.diagrams[0].title);
		    expect(testDiagrams[0].thumbnail).toContain('generic');
		    expect(testDiagrams[0].diagramType).toBe(tmBomModel.diagrams[0].type);
		    expect(testDiagrams[0].id).toBe(0);

        });
    });
});
