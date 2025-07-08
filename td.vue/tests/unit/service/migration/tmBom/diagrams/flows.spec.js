import data_flows from '@/service/migration/tmBom/diagrams/flows';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/flows.js', () => {
    describe('finds the flows', () => {
        it('counts flows in model', () => {
            expect(data_flows.placeFlows(tmBomModel)).toHaveLength(23);
        });
    });

    describe('configures the flows', () => {
        let dataFlows;
        beforeEach(() => {
            dataFlows = data_flows.placeFlows(tmBomModel);
        });

        it('sets the name', () => {
		    expect(dataFlows[0].data.name).toBe('Azure Cognitive Services to Gather Images Application');
		    expect(dataFlows[11].data.name).toBe('Source Code and Configuration to Deployment');
		    expect(dataFlows[22].data.name).toBe('Third Party Tools to Simple Python Web Server');
        });

        it('sets the zIndex', () => {
		    expect(dataFlows[0].zIndex).toEqual(0);
		    expect(dataFlows[5].zIndex).toEqual(5);
		    expect(dataFlows[22].zIndex).toEqual(22);
        });

        it('sets the ID', () => {
		    expect(dataFlows[6].id).toBe('api-key-storage-gather-images');
		    expect(dataFlows[12].id).toBe('user-api-gateway');
		    expect(dataFlows[18].id).toBe('bastion-logs-storage');
        });

        it('sets the source cell', () => {
		    expect(dataFlows[0].source.cell).toBe('azure-cognitive-services');
		    expect(dataFlows[15].source.cell).toBe('bastion');
		    expect(dataFlows[22].source.cell).toBe('third-party-tools');
        });

        it('sets the target cell', () => {
            expect(dataFlows[0].target.cell).toBe('gather-images');
            expect(dataFlows[10].target.cell).toBe('deployment-service');
            expect(dataFlows[22].target.cell).toBe('web-service');
        });

        it('copies the description', () => {
            expect(dataFlows[0].data.description).toContain('Transfer data from Azure');
            expect(dataFlows[20].data.description).toContain('Transfer sensitive data from Bastion');
            expect(dataFlows[22].data.description).toContain('Transfer data from Third Party');
        });

        it('sets the isEncrypted property', () => {
            expect(dataFlows[0].data.isEncrypted).toBe(true);
            expect(dataFlows[5].data.isEncrypted).toBe(false);
            expect(dataFlows[22].data.isEncrypted).toBe(true);
        });
    });
});
