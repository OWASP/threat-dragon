import diagrams from '@/service/migration/tmBom/diagrams/diagrams';
import tmBomModel from '../husky-ai-threat-model';

describe('service/migration/tmBom/diagrams/diagrams.js', () => {
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
            expect(testDiagrams[0].thumbnail).toContain('thumbnail.jpg');
            expect(testDiagrams[0].diagramType).toBe(tmBomModel.diagrams[0].type);
            expect(testDiagrams[0].id).toBe(0);

        });
    });

    describe('handle missing TM-BOM components', () => {
        let model;
        it('creates a default diagram', () => {
            model = JSON.parse(JSON.stringify(tmBomModel));
            delete model.diagrams;
            testDiagrams = diagrams.read(model, version);

            expect(testDiagrams[0].title).toBe('TM-BOM diagram');
            expect(testDiagrams[0].diagramType).toBe('generic');
            expect(testDiagrams[0].id).toBe(0);

        });
    });
});
