import tmBom from '@/service/migration/tmBom/tmBom';

import huskyaiModel from '@/service/demo/huskyai.tmbom.json';
import tmBomModel from './tmbom-test-model';

describe('service/migration/tmBom/tmBom.importTmbom', () => {

    describe('import/merge new model', () => {
        const testModel = tmBom.importTmbom(huskyaiModel);

        it('provides version', () => {
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });
            
        it('creates summary', () => {
            expect(testModel.summary.title.length).toBeGreaterThan(1);
            expect(testModel.summary.owner).toHaveLength(0);
            expect(testModel.summary.description.length).toBeGreaterThan(1);
            expect(testModel.summary.id).toBe(0);
            expect(testModel.summary.compatibility).not.toBeUndefined();
        });
            
        it('creates detail', () => {
            expect(testModel.detail.contributors.length).toBeGreaterThanOrEqual(1);
            expect(testModel.detail.diagramTop).toBeGreaterThanOrEqual(1);
            expect(testModel.detail.reviewer).toHaveLength(0);
            expect(testModel.detail.threatTop).toBeGreaterThanOrEqual(1);
        });

        it('creates diagrams', () => {
            expect(testModel.detail.diagrams).toHaveLength(1);
            expect(testModel.detail.diagrams[0].version.length).toBeGreaterThanOrEqual(5);
            expect(testModel.detail.diagrams[0].title.length).toBeGreaterThanOrEqual(1);
            expect(testModel.detail.diagrams[0].thumbnail).toContain('.jpg');
            expect(testModel.detail.diagrams[0].diagramType).toEqual('TM-BOM');
            expect(testModel.detail.diagrams[0].id).toBe(0);
        });

        it('creates diagram cells', () => {
            expect(testModel.detail.diagrams[0].cells.length).toBeGreaterThanOrEqual(4);
        });

    });

    describe('import/merge test model', () => {
        const testModel = tmBom.importTmbom(tmBomModel);

        it('provides version', () => {
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });
            
        it('creates summary', () => {
            expect(testModel.summary.title.length).toBeGreaterThan(1);
            expect(testModel.summary.owner).toHaveLength(0);
            expect(testModel.summary.description.length).toBeGreaterThan(1);
            expect(testModel.summary.id).toBe(0);
            expect(testModel.summary.compatibility).not.toBeUndefined();
        });
            
        it('creates detail', () => {
            expect(testModel.detail.contributors.length).toBeGreaterThanOrEqual(1);
            expect(testModel.detail.diagramTop).toBeGreaterThanOrEqual(1);
            expect(testModel.detail.reviewer).toHaveLength(0);
            expect(testModel.detail.threatTop).toBeGreaterThanOrEqual(1);
        });

        it('creates diagrams', () => {
            expect(testModel.detail.diagrams).toHaveLength(2);
            expect(testModel.detail.diagrams[0].version.length).toBeGreaterThanOrEqual(5);
            expect(testModel.detail.diagrams[0].title.length).toBeGreaterThanOrEqual(1);
            expect(testModel.detail.diagrams[0].thumbnail).toContain('.jpg');
            expect(testModel.detail.diagrams[0].diagramType).toEqual('TM-BOM');
            expect(testModel.detail.diagrams[0].id).toBe(0);
        });

        it('creates diagram cells', () => {
            expect(testModel.detail.diagrams[0].cells.length).toBeGreaterThanOrEqual(4);
        });

    });
});
