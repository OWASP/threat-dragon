import flows from '@/service/migration/tmBom/diagrams/flows';
import tdModel from '../td-test-model';
import tmBomModel from '../tmbom-test-model';

describe('service/migration/tmBom/diagrams/flows.js', () => {

    describe('convert/export TM-BOM data-flows', () => {
        let dataFlows;

        beforeEach(() => {
            dataFlows = flows.convert(tdModel);
        });

        it('converts data flows', () => {
            expect(dataFlows.length).toBeGreaterThan(4);
        });

        it('populates the data flows', () => {
            expect(dataFlows.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(dataFlows.find((x) => x.title === undefined)).toBeUndefined();
            expect(dataFlows.find((x) => x.description === undefined)).toBeUndefined();
            expect(dataFlows.find((x) => x.source === undefined)).toBeUndefined();
            expect(dataFlows.find((x) => x.destination === undefined)).toBeUndefined();
            expect(dataFlows.find((x) => x.has_sensitive_data === undefined)).toBeUndefined();
            expect(dataFlows.find((x) => x.encrypted === undefined)).toBeUndefined();
        });

    });

    describe('merge/import TM-BOM data-flows', () => {

        describe('finds the flows', () => {
            it('counts flows in model', () => {
                expect(flows.merge(tmBomModel)).toHaveLength(tmBomModel.data_flows.length);
            });
        });

        describe('configures the flows', () => {
            let dataFlows;
            beforeEach(() => {
                dataFlows = flows.merge(tmBomModel);
            });

            it('sets the name', () => {
                expect(dataFlows[0].data.name).toBe('Test title data-flow0');
                expect(dataFlows[2].data.name).toBe('Test title data-flow2');
                expect(dataFlows[4].data.name).toBe('Test title data-flow4');
            });

            it('sets the zIndex', () => {
                expect(dataFlows[0].zIndex).toEqual(0);
                expect(dataFlows[2].zIndex).toEqual(2);
                expect(dataFlows[4].zIndex).toEqual(4);
            });

            it('sets the ID', () => {
                expect(dataFlows[0].id).toBe('data-flow0');
                expect(dataFlows[2].id).toBe('data-flow2');
                expect(dataFlows[4].id).toBe('data-flow4');
            });

            it('sets the source cell', () => {
                expect(dataFlows[0].source.cell).toBe('actor0');
                expect(dataFlows[2].source.cell).toBe('actor2');
                expect(dataFlows[4].source.cell).toBe('component4');
            });

            it('sets the target cell', () => {
                expect(dataFlows[0].target.cell).toBe('component0');
                expect(dataFlows[2].target.cell).toBe('actor3');
                expect(dataFlows[4].target.cell).toBe('data-store2');
            });

            it('copies the description', () => {
                expect(dataFlows[0].data.description).toContain('description data-flow0');
                expect(dataFlows[2].data.description).toContain('description data-flow2');
                expect(dataFlows[4].data.description).toContain('description data-flow4');
            });

            it('sets the isEncrypted property', () => {
                expect(dataFlows[0].data.isEncrypted).toBe(true);
                expect(dataFlows[2].data.isEncrypted).toBe(false);
                expect(dataFlows[4].data.isEncrypted).toBe(true);
            });
        });

        describe('handles model with no data flows', () => {
            const noDataFlowsModel = JSON.parse(JSON.stringify(tmBomModel));
            delete noDataFlowsModel.data_flows;
            const dataFlows = flows.merge(noDataFlowsModel);

            it('adds no data flows', () => {
                expect(dataFlows).toEqual([]);
            });
        });
    });
});
