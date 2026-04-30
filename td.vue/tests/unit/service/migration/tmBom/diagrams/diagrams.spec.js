import diagrams from '@/service/migration/tmBom/diagrams/diagrams';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/diagrams.js', () => {
    let testDiagrams;
    const version = 'x.y.zz';

    describe('merge', () => {
        beforeEach(() => {
            testDiagrams = diagrams.merge(tmBomModel, version);
        });

        it('import TM-BOM diagrams', () => {
            expect(testDiagrams).toHaveLength(tmBomModel.diagrams.length + 1);
        });

        it('versions the diagram', () => {
            expect(testDiagrams[0].version).toBe(version);
        });

        it('creates a default diagram', () => {
            expect(testDiagrams[0].title).toBe('Test title scope');
            expect(testDiagrams[0].diagramType).toBe('TM-BOM');
            expect(testDiagrams[0].id).toBe(0);

        });

        it('configures the diagram', () => {
            expect(testDiagrams[1].title).toBe(tmBomModel.diagrams[0].title);
            expect(testDiagrams[1].thumbnail).toContain('thumbnail.jpg');
            expect(testDiagrams[1].diagramType).toBe(tmBomModel.diagrams[0].type);
            expect(testDiagrams[1].id).toBe(1);
        });

    });

    describe('merge main diagram', () => {
        beforeEach(() => {
            delete(tmBomModel.diagrams);
		    testDiagrams = diagrams.merge(tmBomModel, version);
        });

        it('creates main diagram', () => {
	    expect(testDiagrams).toHaveLength(1);
        });

    });
});
