import assumptions from '@/service/migration/tmBom/diagrams/assumptions';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/assumptions.js', () => {
    describe('updates summary descriptions', () => {
        let summaryAssumptions = assumptions.summary(tmBomModel);

        it('counts the assumptions in the summary', () => {
            expect(summaryAssumptions).toHaveLength(1);
        });

        it('provides the assumption description', () => {
            expect(summaryAssumptions[0].description).toContain('validate tokens via Auth Service');
        });

        it('provides the assumption validity', () => {
            expect(summaryAssumptions[0].validity).toBe('confirmed');
        });

    });
});
