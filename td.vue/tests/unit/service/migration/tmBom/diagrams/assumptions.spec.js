import assumptions from '@/service/migration/tmBom/diagrams/assumptions';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/assumptions.js', () => {

    describe('updates summary descriptions', () => {
        let summaryAssumptions = assumptions.summary(tmBomModel);

        it('counts assumptions not associated with a component', () => {
            expect(summaryAssumptions).toHaveLength(2);
        });

        it('provides the assumption description', () => {
            expect(summaryAssumptions[0].description).toContain('assumption0');
        });

        it('provides the assumption validity', () => {
            expect(summaryAssumptions[0].validity).toBe('confirmed');
            expect(summaryAssumptions[1].validity).toBe('rejected');
        });
    });

    describe('handles absence of assumptions', () => {
        let noAssumptionsModel = JSON.parse(JSON.stringify(tmBomModel));
        delete noAssumptionsModel.assumptions;

	    it('provides empty assumptions', () => {
            let summaryAssumptions = assumptions.summary(noAssumptionsModel);
	        expect(summaryAssumptions).toHaveLength(0);
	    });

        it('preserves summary descriptions', () => {
            let components = [{data : {description: 'test description'}}];
		    let componentAssumptions = assumptions.merge(noAssumptionsModel, components);
		    expect(componentAssumptions).toHaveLength(1);
            expect(componentAssumptions[0].data.description).toEqual('test description');
        });
    });
});
