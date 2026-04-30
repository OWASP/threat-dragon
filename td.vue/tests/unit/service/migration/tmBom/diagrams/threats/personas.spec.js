import personas from '@/service/migration/tmBom/diagrams/threats/personas';
import tmBom from '../../test-model';

describe('service/migration/tmBom/diagrams/threats/personas.js', () => {

    describe('merge person into description', () => {

        it('finds the threat persona', () => {
            expect(personas.merge(tmBom, 'threat-persona0').length).toBeGreaterThan(1);
            expect(personas.merge(tmBom, 'threat-persona5').length).toBeGreaterThan(1);
        });

        it('provides persona title', () => {
            let persona = personas.merge(tmBom, 'threat-persona0');
            expect(persona).toContain('title threat persona0');
        });

        it('provides persona description', () => {
            let persona = personas.merge(tmBom, 'threat-persona1');
            expect(persona).toContain('description threat persona1');
        });

        it('provides access levels', () => {
            let persona = personas.merge(tmBom, 'threat-persona2');
            expect(persona).toContain('user');
        });

        it('provides skill levels', () => {
            let persona = personas.merge(tmBom, 'threat-persona3');
		    expect(persona).toContain('expert engineer');
        });

        it('identifies automated threat personas', () => {
            let persona = personas.merge(tmBom, 'threat-persona4');
		    expect(persona).toContain('Automated threat');
        });

        it('identifies malicious intent', () => {
            let persona = personas.merge(tmBom, 'threat-persona5');
            expect(persona).toContain('malicious intent');
        });

        it('provides org applicability', () => {
            let persona = personas.merge(tmBom, 'threat-persona0');
            expect(persona).toContain('minimal applicability');
        });

    });
});
