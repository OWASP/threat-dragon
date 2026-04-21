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
            expect(personas.threat_persona0).toContain('persona0');
            expect(personas.threat_persona1).toContain('persona1');
        });

        it('provides persona descriptions', () => {
            expect(personas.threat_persona0).toContain('Test description');
            expect(personas.threat_persona1).toContain('Test description');
        });

        it('identifies automated threat personas', () => {
            expect(personas.threat_persona0).not.toContain('Automated threat');
            expect(personas.threat_persona1).toContain('Automated threat');
        });

        it('provides skill levels', () => {
            expect(personas.threat_persona0).toContain('Skill level is expert_engineer');
            expect(personas.threat_persona1).toContain('Skill level is oc_sponsored');
        });

        it('provides access levels', () => {
            expect(personas.threat_persona0).toContain('user access level');
            expect(personas.threat_persona1).toContain('anonymous access level');
        });

        it('identifies malicious intent', () => {
            expect(personas.threat_persona0).not.toContain('malicious intent');
            expect(personas.threat_persona1).toContain('malicious intent');
        });

        it('provides org applicability', () => {
            expect(personas.threat_persona0).toContain('high applicability');
            expect(personas.threat_persona1).toContain('moderate applicability');
        });

    });
});
