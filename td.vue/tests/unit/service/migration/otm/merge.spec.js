import otm from '@/service/migration/otm/otm';

import mobileCloudModel from '@/service/demo/mobile-cloud.otm.json';
import otmModel from '../otm-test-model';

describe('service/migration/otm/otm.importOtm', () => {

    describe('importing / merge Mobile Cloud model', () => {
        const testModel = otm.importOtm(mobileCloudModel);

        beforeEach(() => {
            console.warn = jest.fn();
            console.error = jest.fn();
        });

        it('imports with no errors or warnings', () => {
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('provides version', () => {
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });

        it('creates summary', () => {
            expect(testModel.summary.title.length).toBeGreaterThan(1);
            expect(testModel.summary.owner).toHaveLength(0);
            expect(testModel.summary.description).toHaveLength(0);
            expect(testModel.summary.id).toBe('mtmt_project_id');
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
            expect(testModel.detail.diagrams[0].diagramType).toEqual('OTM');
            expect(testModel.detail.diagrams[0].id).toBe(0);
        });

        it('creates diagram cells', () => {
            expect(testModel.detail.diagrams[0].cells.length).toBeGreaterThanOrEqual(4);
        });

    });

    describe('importing / merge test model', () => {
        const testModel = otm.importOtm(otmModel);

        beforeEach(() => {
            console.warn = jest.fn();
            console.error = jest.fn();
        });

        it('imports with no errors or warnings', () => {
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
        });
            
        it('provides version', () => {
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });
            
        it('creates summary', () => {
            expect(testModel.summary.title.length).toBeGreaterThan(5);
            expect(testModel.summary.owner.length).toBeGreaterThan(5);
            expect(testModel.summary.description.length).toBeGreaterThan(5);
            expect(testModel.summary.id).toBe('test-project');
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
            expect(testModel.detail.diagrams[1].version.length).toBeGreaterThanOrEqual(5);
            expect(testModel.detail.diagrams[1].title.length).toBeGreaterThanOrEqual(1);
            expect(testModel.detail.diagrams[1].thumbnail).toContain('.jpg');
            expect(testModel.detail.diagrams[1].diagramType).toEqual('OTM');
            expect(testModel.detail.diagrams[1].id).toBe(1);
        });

        it('creates diagram cells', () => {
            expect(testModel.detail.diagrams[0].cells).toHaveLength(2);
        });

    });
});
