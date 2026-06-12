import diagrams from '@/service/migration/tmBom/diagrams/diagrams';
import tmBomModel from '../tmbom-test-model';
import tdModel from '../td-test-model';

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
            delete (tmBomModel.diagrams);
            testDiagrams = diagrams.merge(tmBomModel, version);
        });

        it('creates main diagram', () => {
            expect(testDiagrams).toHaveLength(1);
        });

    });

    describe('convert', () => {
        const noCompatibilityModel = JSON.parse(JSON.stringify(tdModel));
        delete noCompatibilityModel.detail.compatibility.diagrams;

        it('copies saved diagrams from compatibility', () => {
            testDiagrams = diagrams.convert(tdModel);
            expect(testDiagrams[0].title.length).toBeGreaterThan(1);
        });

        it('defaults when no compatibility', () => {
            testDiagrams = diagrams.convert(noCompatibilityModel);
            expect(testDiagrams[0]).toBe(undefined);
        });
    });
});
