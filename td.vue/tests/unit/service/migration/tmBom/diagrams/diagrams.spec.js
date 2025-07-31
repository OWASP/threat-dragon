import diagrams from '@/service/migration/tmBom/diagrams/diagrams';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/diagrams.js', () => {
    let testDiagrams;
    const version = 'x.y.zz';

    describe('import TM-BOM diagrams', () => {
        beforeEach(() => {
            testDiagrams = diagrams.read(tmBomModel, version);
        });

        it('finds both diagrams', () => {
            expect(testDiagrams).toHaveLength(2);
        });

        it('versions the diagram', () => {
            expect(testDiagrams[0].version).toBe(version);
        });

        it('creates a default diagram', () => {
            expect(testDiagrams[0].title).toBe('Husky AI');
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
});
