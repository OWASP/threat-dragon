import threats from '@/service/migration/tmBom/diagrams/threats/threats';
import tmBomModel from '../../test-model';

describe('service/migration/tmBom/diagrams/threats/threats.js', () => {

    describe('find TM-BOM threats', () => {
        let tdThreats;

        beforeEach(() => {
            tdThreats = threats.findThreats(tmBomModel);
        });

        it('finds the threats', () => {
            expect(tdThreats).toHaveLength(9);
        });
    });

    describe('find TM-BOM threat personas', () => {
        let personas = threats.findPersonas(tmBomModel);

        it('finds the personas', () => {
            expect(Object.keys(personas)).toHaveLength(2);
        });

        it('provides persona titles', () => {
            expect(personas.ratimir).toContain('Ratimir');
            expect(personas.michiko).toContain('Michiko');
        });

        it('provides persona descriptions', () => {
            expect(personas.ratimir).toContain('An expert social engineer');
            expect(personas.michiko).toContain('a lot of acquired knowledge');
        });

        it('identifies automated threat personas', () => {
            expect(personas.ratimir).not.toContain('Automated threat');
            expect(personas.michiko).not.toContain('Automated threat');
        });

        it('provides skill levels', () => {
            expect(personas.ratimir).toContain('Skill level is expert_engineer');
            expect(personas.michiko).toContain('Skill level is oc_sponsored');
        });

        it('provides access levels', () => {
            expect(personas.ratimir).toContain('user access level');
            expect(personas.michiko).toContain('admin access level');
        });

        it('identifies malicious intent', () => {
            expect(personas.ratimir).toContain('malicious intent');
            expect(personas.michiko).toContain('malicious intent');
        });

        it('provides org applicability', () => {
            expect(personas.ratimir).toContain('high applicability');
            expect(personas.michiko).toContain('moderate applicability');
        });

    });
});
