import boxes from '@/service/migration/tmBom/diagrams/boxes';
import detail from '@/service/migration/tmBom/detail';
import diagrams from '@/service/migration/tmBom/diagrams/diagrams';
import flows from '@/service/migration/tmBom/diagrams/flows';
import nodes from '@/service/migration/tmBom/diagrams/nodes';
import scope from '@/service/migration/tmBom/scope';
import summary from '@/service/migration/tmBom/summary';
import threats from '@/service/migration/tmBom/diagrams/threats/threats';
import tmBom from '@/service/migration/tmBom/tmBom';

import tdModel from './td-test-model';
import tmBomModel from './tmbom-test-model';

jest.mock('@/service/migration/tmBom/diagrams/boxes');
jest.mock('@/service/migration/tmBom/detail');
jest.mock('@/service/migration/tmBom/diagrams/diagrams');
jest.mock('@/service/migration/tmBom/diagrams/flows');
jest.mock('@/service/migration/tmBom/diagrams/nodes');
jest.mock('@/service/migration/tmBom/scope');
jest.mock('@/service/migration/tmBom/summary');
jest.mock('@/service/migration/tmBom/diagrams/threats/threats');

const mockCombinedModel = {
    version: '2.x.x',
    summary: {
        title: tmBomModel.scope.title,
        description: 'Empty Threat Dragon model from a TM-BOM',
    },
    detail: [],
    tmBom: tmBomModel
};

describe('service/migration/tmBom/tmBom.js', () => {

    describe('exportAsTmbom', () => {
        let testModel;

        describe('export to TM-BOM format', () => {
            beforeEach(() => {
                boxes.convert.mockReturnValue([]);
                diagrams.convert.mockReturnValue([]);
                flows.convert.mockReturnValue([]);
                nodes.convert.mockReturnValue({actors: [], components: [], data_stores: []});
                scope.convert.mockReturnValue(tmBomModel.scope);
                threats.convert.mockReturnValue({controls: [], risks: [], threats: [], threat_personas: []});
                testModel = tmBom.exportAsTmbom(tdModel);
            });

            it('provides mandatory values', () => {
                expect(testModel.$schema).toContain('threat-model.schema.json');
                expect(testModel.version).toBe(tdModel.compatibility.version);
            });

            it('reinstates the compatibility values', () => {
                expect(testModel.description).toBe(tdModel.compatibility.description);
                expect(testModel.frozen).toBe(tdModel.compatibility.frozen);
                expect(testModel.release_docs_link).toBe(tdModel.compatibility.release_docs_link);
                expect(testModel.reviewed_at).toBe(tdModel.compatibility.reviewed_at);
                expect(testModel.repo_link).toBe(tdModel.compatibility.repo_link);
            });

            it('creates the TM-BOM scope', () => {
                expect(testModel.scope).toEqual(tmBomModel.scope);
            });
        });

        describe('handles missing TM-BOM objects', () => {
            beforeEach(() => {
                boxes.convert.mockReturnValue([]);
                diagrams.convert.mockReturnValue([]);
                flows.convert.mockReturnValue([]);
                nodes.convert.mockReturnValue({actors: [], components: [], data_stores: []});
                scope.convert.mockReturnValue(tmBomModel.summary);
                threats.convert.mockReturnValue({controls: [], risks: [], threats: [], threat_personas: []});
            });

            it('defaults absent required values', () => {
                const noCompatibilityModel = JSON.parse(JSON.stringify(tdModel));
                delete noCompatibilityModel.compatibility;
                testModel = tmBom.exportAsTmbom(noCompatibilityModel);
                expect(testModel.version.length).toBeGreaterThanOrEqual(5);
            });

            it('defaults absent optional values', () => {
                const noOptionsModel = JSON.parse(JSON.stringify(tdModel));
                delete noOptionsModel.compatibility.frozen;
                delete noOptionsModel.compatibility.repo_link;
                testModel = tmBom.exportAsTmbom(noOptionsModel);
                expect(testModel.description.length).toBeGreaterThan(1);
                expect(testModel.frozen).toBeUndefined();
                expect(testModel.release_docs_link).toBe(tmBomModel.release_docs_link);
                expect(testModel.reviewed_at).toBe(tmBomModel.reviewed_at);
                expect(testModel.repo_link).toBeUndefined();
            });
        });
    });

    describe('importTmbom', () => {
        let testModel;
        const detailReturn = 'test detail';
        const summaryReturn = 'test summary';

        describe('import from TM-BOM format', () => {
            beforeEach(() => {
                summary.merge.mockReturnValue(summaryReturn);
                detail.merge.mockReturnValue(detailReturn);
                testModel = tmBom.importTmbom(tmBomModel);
            });

            it('provides version', () => {
                expect(testModel.version.length).toBeGreaterThanOrEqual(5);
            });
            
            it('creates the summary', () => {
                expect(testModel.summary).toEqual(summaryReturn);
            });
            
            it('creates the detail and diagrams', () => {
                expect(testModel.detail).toEqual(detailReturn);
            });
            
            it('stores the required compatibility values', () => {
                expect(testModel.compatibility.version).toBe(tmBomModel.version);
                expect(testModel.compatibility.description).toBe(tmBomModel.description);
            });
            
            it('stores the compatibility values', () => {
                expect(testModel.compatibility.version).toBe(tmBomModel.version);
                expect(testModel.compatibility.frozen).toBe(tmBomModel.frozen);
                expect(testModel.compatibility.release_docs_link).toBe(tmBomModel.release_docs_link);
                expect(testModel.compatibility.reviewed_at).toBe(tmBomModel.reviewed_at);
                expect(testModel.compatibility.repo_link).toBe(tmBomModel.repo_link);
            });
        });

        describe('handles missing TM-BOM objects', () => {
            it('skips absent optional values', () => {
                const noOptionsModel = JSON.parse(JSON.stringify(tmBomModel));
                delete noOptionsModel.frozen;
                delete noOptionsModel.repo_link;
                testModel = tmBom.importTmbom(noOptionsModel);
                expect(testModel.compatibility.frozen).toBeUndefined();
                expect(testModel.compatibility.release_docs_link).toBe(tmBomModel.release_docs_link);
                expect(testModel.compatibility.reviewed_at).toBe(tmBomModel.reviewed_at);
                expect(testModel.compatibility.repo_link).toBeUndefined();
            });
        });
    });

    describe('read', () => {
        let testModel;

        beforeEach(() => {
            testModel = tmBom.read(tmBomModel);
        });

        it('adds the Threat Dragon version', () => {
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });

        it('creates the Threat Dragon summary', () => {
            expect(testModel.summary.title).toStrictEqual(tmBomModel.scope.title);
            expect(testModel.summary.description.length).toBeGreaterThan(1);
        });

        it('preserves the original TM-BOM', () => {
            expect(testModel.tmBom).toStrictEqual(tmBomModel);
        });

    });

    describe('write', () => {
        let testModel;

        beforeEach(() => {
            testModel = tmBom.write(mockCombinedModel);
        });

        it('adds the TM-BOM schema version', () => {
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });

        it('creates the TM-BOM scope', () => {
            expect(testModel.scope.title).toStrictEqual(mockCombinedModel.tmBom.scope.title);
            expect(testModel.scope.description.length).toBeGreaterThan(1);
        });

    });
});
