import dataflows from '@/service/migration/otm/cells/dataflows';

describe('service/migration/otm/cells/dataflow.js', () => {

    describe('merge OTM', () => {
        let testFlow;

        describe('creates flow', () => {
            const dataflow = {
                name: 'Test data flow name',
                id: 'test-data-flow-id',
                description: 'test-data-flow-description',
                bidirectional: true,
                source: 'test-data-flow-source',
                destination: 'test-data-flow-destination',
                assets: ['test-data-flow-asset'],
                attributes: {attr1: 'value1', attr2: 'value2'},
                tags: ['tomcat']
            };

            beforeEach(() => {
                testFlow = dataflows.merge(dataflow);
            });

            it('creates flow type', () => {
                expect(testFlow.shape).toBe('flow');
            });

            it('creates flow ID', () => {
                expect(testFlow.id).toBe(dataflow.id);
            });

            it('creates flow name', () => {
                expect(testFlow.data.name).toBe(dataflow.name);
                expect(testFlow.labels[0].attrs.labelText.text).toBe(dataflow.name);
            });

            it('creates flow direction type', () => {
			    expect(testFlow.data.isBidirectional).toBe(dataflow.bidirectional);
            });

            it('creates flow description', () => {
                expect(testFlow.data.description).toBe(dataflow.description);
            });

            it('creates flow source', () => {
                expect(testFlow.source.cell).toBe(dataflow.source);
            });

            it('creates flow target', () => {
                expect(testFlow.target.cell).toBe(dataflow.destination);
            });

            it('creates flow compatibility attributes', () => {
                expect(testFlow.compatibility.attributes).toEqual(dataflow.attributes);
            });

            it('creates flow compatibility tags', () => {
                expect(testFlow.compatibility.tags).toEqual(dataflow.tags);
            });
        });
 
        describe('creates minimal flow', () => {
            const dataflow = {
                name: 'Another test data flow name',
                id: 'another-test-data-flow-id',
                source: 'another-test-data-flow-source',
                destination: 'another-test-data-flow-destination'
            };

            beforeEach(() => {
                testFlow = dataflows.merge(dataflow);
            });

            it('creates flow type', () => {
			    expect(testFlow.shape).toBe('flow');
            });

            it('creates flow ID', () => {
			    expect(testFlow.id).toBe(dataflow.id);
            });

            it('creates flow name', () => {
			    expect(testFlow.data.name).toBe(dataflow.name);
			    expect(testFlow.labels[0].attrs.labelText.text).toBe(dataflow.name);
            });

            it('preserves flow direction type', () => {
			    expect(testFlow.data.isBidirectional).toBe(false);
            });

            it('creates flow description', () => {
			    expect(testFlow.data.description).toBe('');
            });

            it('creates flow source', () => {
			    expect(testFlow.source.cell).toBe(dataflow.source);
            });

            it('creates flow position', () => {
			    expect(testFlow.target.cell).toBe(dataflow.destination);
            });

            it('creates flow compatibility attributes', () => {
			    expect(testFlow.compatibility.attributes).toBeUndefined();
            });

            it('creates flow compatibility tags', () => {
			    expect(testFlow.compatibility.tags).toBeUndefined();
            });
        });
    });
});
