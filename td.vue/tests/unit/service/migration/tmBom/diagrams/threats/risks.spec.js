import risks from '@/service/migration/tmBom/diagrams/threats/risks';
import tmBomModel from '../../test-model';
import { threats as mockTdThreats } from './mockTdThreats';

describe('service/migration/tmBom/diagrams/threats/risks.js', () => {
    describe('updates threat descriptions', () => {
        let threats = risks.merge(tmBomModel, mockTdThreats);

        it('provides the risk title', () => {
            expect(threats[0].description).toContain('Test title risk0');
            expect(threats[0].description).toContain('Test title risk1');
            expect(threats[2].description).toContain('Test title risk3');
            expect(threats[2].description).not.toContain('risk1');
            expect(threats[4].description).toContain('Test title risk5');
            expect(threats[4].description).not.toContain('risk1');
        });

        it('provides the risk description', () => {
            expect(threats[0].description).toContain('Test description risk0');
            expect(threats[0].description).toContain('Test description risk1');
            expect(threats[2].description).not.toContain('risk1');
            expect(threats[4].description).toContain('Test description risk5');
        });

        it('provides the risk level', () => {
            expect(threats[0].description).toContain('a very low risk');
            expect(threats[0].description).toContain('a low risk');
            expect(threats[2].description).not.toContain('medium risk');
            expect(threats[4].description).toContain('a critical risk');
        });

        it('provides the liklihood', () => {
		    expect(threats[0].description).toContain('rare liklihood');
		    expect(threats[0].description).toContain('unlikely liklihood');
		    expect(threats[2].description).not.toContain('unlikely');
		    expect(threats[4].description).toContain('certain liklihood');
        });

        it('provides the impact', () => {
            expect(threats[0].description).toContain('and negligible impact');
            expect(threats[0].description).toContain('and minor impact');
            expect(threats[2].description).not.toContain('minor');
            expect(threats[4].description).toContain('and severe impact');
        });

        it('describes the impact', () => {
            expect(threats[0].description).toContain('Test impact description risk0');
            expect(threats[0].description).toContain('Test impact description risk1');
            expect(threats[2].description).not.toContain('risk1');
            expect(threats[4].description).toContain('Test impact description risk5');
        });

        it('sets the risk score', () => {
            expect(threats[0].score).toBe(5);
            expect(threats[1].score).toBe(10);
            expect(threats[4].score).toBe(25);
        });
    });

    describe('handles absence of risk', () => {
        let emptyRisksModel = JSON.parse(JSON.stringify(tmBomModel));
        delete emptyRisksModel.risks;
        let threats = risks.merge(emptyRisksModel, mockTdThreats);

        it('preserves the threats', () => {
		    expect(threats).toStrictEqual(mockTdThreats);
        });
    });
});
