import risks from '@/service/migration/tmBom/diagrams/threats/risks';
import tmBomModel from '../../test-model';

const mockTdThreats = [
    {
        score: 3,
        description: 'An attacker crafts an image',
        id: 'notebook-tampering'
    },
    {
        score: 0,
        description: 'An attacker poisons the supply chain',
        id: 'supply-chain-attack'
    },
    {
        score: null,
        description: 'An attacker tampers with or deletes stored images',
        id: 'image-tampering'
    },
    {
        score: 25,
        description: 'An attacker modifies a notebook file',
        id: 'ssh-compromise-developer-machine'
    }
];

describe('service/migration/tmBom/diagrams/threats/risks.js', () => {
    describe('updates threat descriptions', () => {
        let threats = risks.merge(tmBomModel, mockTdThreats);

        it('provides the risk title', () => {
            expect(threats[0].description).toContain('Adversarial attacks');
            expect(threats[1].description).not.toContain('Web attacks');
            expect(threats[2].description).toContain('Adversarial attacks');
            expect(threats[3].description).toContain('Unauthorized SSH access');
        });

        it('provides the risk description', () => {
            expect(threats[0].description).toContain('Attackers could manipulate');
            expect(threats[1].description).not.toContain('Attackers could manipulate');
            expect(threats[2].description).toContain('Attackers could manipulate');
            expect(threats[3].description).not.toContain('Attackers could manipulate');
        });

        it('provides the risk level', () => {
            expect(threats[0].description).toContain('a medium risk');
            expect(threats[1].description).toContain('a high risk');
            expect(threats[2].description).toContain('a medium risk');
            expect(threats[3].description).toContain('a high risk');
        });

        it('details the risk', () => {
            expect(threats[0].description).toContain('unlikely liklihood');
            expect(threats[1].description).toContain('moderate impact');
            expect(threats[2].description).not.toContain('moderate impact');
            expect(threats[3].description).toContain('Operational disruption');
        });

        it('sets the risk score', () => {
            expect(threats[0].score).toBe(8);
            expect(threats[1].score).toBe(9);
            expect(threats[2].score).toBe(8);
            expect(threats[3].score).toBe(25);
        });

    });
});
