import assumptions from '@/service/migration/tmBom/diagrams/assumptions';
import tmBomModel from '../tmbom-test-model';

describe('service/migration/tmBom/diagrams/assumptions.js', () => {

    describe('updates summary descriptions', () => {
        const summaryAssumptions = assumptions.summary(tmBomModel);

        it('counts assumptions not associated with a component', () => {
            expect(summaryAssumptions).toHaveLength(2);
        });

        it('provides the assumption description', () => {
            expect(summaryAssumptions[0].description).toContain('description assumption2');
            expect(summaryAssumptions[1].description).toContain('description assumption3');
        });

        it('provides the assumption validity', () => {
            expect(summaryAssumptions[0].validity).toBe('rejected');
            expect(summaryAssumptions[1].validity).toBe('unconfirmed');
        });
    });

    describe('handles absence of assumptions', () => {
        const noAssumptionsModel = JSON.parse(JSON.stringify(tmBomModel));
        delete noAssumptionsModel.assumptions;

	    it('provides empty assumptions', () => {
            const summaryAssumptions = assumptions.summary(noAssumptionsModel);
	        expect(summaryAssumptions).toHaveLength(0);
	    });

        it('preserves summary descriptions', () => {
            const components = [{data : {description: 'test description'}}];
		    const componentAssumptions = assumptions.merge(noAssumptionsModel, components);
		    expect(componentAssumptions).toHaveLength(1);
            expect(componentAssumptions[0].data.description).toEqual('test description');
        });
    });
});
