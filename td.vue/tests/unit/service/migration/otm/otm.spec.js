import diagrams from '@/service/migration/otm/diagrams';
import summary from '@/service/migration/otm/summary';

import otm from '@/service/migration/otm/otm';
import otmModel from '../otm-test-model';

jest.mock('@/service/migration/otm/diagrams');
jest.mock('@/service/migration/otm/summary');

describe('service/migration/otm/otm.js', () => {

    describe('importOtm', () => {
        let testModel;
        const summaryReturn = 'test summary';

        describe('importing from OTM format', () => {
            const diagramsReturn = {
                diagrams: [{title: 'test foo'}, {title: 'test bar'}],
                codeRepresentations: [{title: 'test baz'}],
                codeComponents: [{title: 'test bay'}]
            };

            beforeEach(() => {
                summary.merge.mockReturnValue(summaryReturn);
                diagrams.merge.mockReturnValue(diagramsReturn);
                testModel = otm.importOtm(otmModel);
            });

            it('provides version', () => {
                expect(testModel.version.length).toBeGreaterThanOrEqual(5);
            });
            
            it('provides the summary', () => {
                expect(testModel.summary).toEqual(summaryReturn);
            });
            
            it('creates the detail contributors', () => {
                expect(testModel.detail.contributors.length).toBeGreaterThanOrEqual(1);
            });
            
            it('provides the detail diagrams', () => {
                expect(testModel.detail.diagrams).toEqual(diagramsReturn.diagrams);
                expect(testModel.detail.diagramTop).toBe(diagramsReturn.diagrams.length);
            });

            it('creates the detail reviewer', () => {
                expect(testModel.detail.reviewer).toEqual('');
            });

            it('creates the detail threatTop', () => {
                expect(testModel.detail.threatTop).toBe(otmModel.threats.length - 1);
            });

            it('stores the compatibility ID', () => {
                expect(testModel.compatibility.otmVersion).toBe(otmModel.otmVersion);
            });

            it('stores the compatibility representations', () => {
                expect(testModel.compatibility.representations).toEqual(diagramsReturn.codeRepresentations);
            });

            it('stores the compatibility components', () => {
                expect(testModel.compatibility.components).toEqual(diagramsReturn.codeComponents);
            });
        });

        describe('handling missing OTM values', () => {
            const missingModel = JSON.parse(JSON.stringify(otmModel));
            const diagramsReturn = {diagrams: []};
            delete missingModel.otmVersion;
            delete missingModel.threats;

            beforeEach(() => {
                summary.merge.mockReturnValue(summaryReturn);
                diagrams.merge.mockReturnValue(diagramsReturn);
                testModel = otm.importOtm(missingModel);
            });
                
            it('provides the detail diagrams', () => {
                expect(testModel.detail.diagrams).toEqual(diagramsReturn.diagrams);
                expect(testModel.detail.diagramTop).toBe(diagramsReturn.diagrams.length);
            });

            it('creates the detail threatTop', () => {
                expect(testModel.detail.threatTop).toBe(0);
            });

            it('stores the compatibility values', () => {
                expect(testModel.compatibility.otmVersion).toBeNull();
                expect(testModel.compatibility.representations).toEqual([]);
                expect(testModel.compatibility.components).toEqual([]);
            });
        });
    });
});
