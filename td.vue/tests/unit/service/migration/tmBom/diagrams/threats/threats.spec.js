import controls from '@/service/migration/tmBom/diagrams/threats/controls';
import assumptions from '@/service/migration/tmBom/diagrams/assumptions';
import risks from '@/service/migration/tmBom/diagrams/threats/risks';
import threats from '@/service/migration/tmBom/diagrams/threats/threats';
import tdModel from '../../td-test-model';
import tmBomModel from '../../tmbom-test-model';

jest.mock('@/service/migration/tmBom/diagrams/assumptions');
jest.mock('@/service/migration/tmBom/diagrams/threats/controls');
jest.mock('@/service/migration/tmBom/diagrams/threats/risks');
assumptions.merge.mockImplementation((_model, threats) => threats);
controls.merge.mockImplementation((_model, threats) => threats);
risks.merge.mockImplementation((_model, threats) => threats);

describe('service/migration/tmBom/diagrams/threats/threats.js', () => {

    describe('convert/export TM-BOM threats', () => {
        let tmbomThreats;
        
        beforeEach(() => {
            tmbomThreats = threats.convert(tdModel);
        });

        it('converts TM-BOM threats', () => {
            expect(tmbomThreats.controls.length).toBeGreaterThan(4);
            expect(tmbomThreats.risks.length).toBeGreaterThan(4);
            expect(tmbomThreats.threats.length).toBeGreaterThan(4);
        });

        it('provides single TM-BOM threat persona', () => {
            expect(tmbomThreats.threat_personas).toHaveLength(1);
            expect(tmbomThreats.threat_personas[0]).toMatchObject(threats.defaults.threatPersona);
        });

        it('populates the array of risks', () => {
            expect(tmbomThreats.risks.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.title === undefined)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.description === undefined)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.threats[0] === undefined)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.likelihood !== threats.defaults.likelihood)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.impact === undefined)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.impact_description === undefined)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.score < 0)).toBeUndefined();
            expect(tmbomThreats.risks.find((x) => x.level !== threats.defaults.riskLevelBand)).toBeUndefined();
        });

        it('populates the array of controls', () => {
            expect(tmbomThreats.controls.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(tmbomThreats.controls.find((x) => x.title === undefined)).toBeUndefined();
            expect(tmbomThreats.controls.find((x) => x.description === undefined)).toBeUndefined();
            expect(tmbomThreats.controls.find((x) => x.threats[0] === undefined)).toBeUndefined();
            expect(tmbomThreats.controls.find((x) => x.status === undefined)).toBeUndefined();
            expect(tmbomThreats.controls.find((x) => x.priority === undefined)).toBeUndefined();
        });

        it('populates the array of threats', () => {
            expect(tmbomThreats.threats.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(tmbomThreats.threats.find((x) => x.title === undefined)).toBeUndefined();
            expect(tmbomThreats.threats.find((x) => x.description === undefined)).toBeUndefined();
            expect(tmbomThreats.threats.find((x) => x.threat_persona === undefined)).toBeUndefined();
            expect(tmbomThreats.threats.find((x) => x.event === undefined)).toBeUndefined();
            expect(tmbomThreats.threats.find((x) => x.sources[0] !== threats.defaults.source)).toBeUndefined();
        });
    });

    describe('merge/import TM-BOM threats', () => {
        const tdThreats = threats.merge(tmBomModel);

        it('finds the threats', () => {
            expect(tdThreats).toHaveLength(tmBomModel.threats.length);
        });

        it('copies the id', () => {
            expect(tdThreats[0].id).toEqual(tmBomModel.threats[0].symbolic_name);
            expect(tdThreats[4].id).toEqual(tmBomModel.threats[4].symbolic_name);
        });

        it('adds the title', () => {
            expect(tdThreats[0].title).toContain('title threat0');
            expect(tdThreats[0].title).not.toContain('threat1');
            expect(tdThreats[4].title).toContain('title threat4');
        });

        it('adds the description', () => {
            expect(tdThreats[0].description).toContain('description threat0');
            expect(tdThreats[0].description).not.toContain('threat1');
            expect(tdThreats[4].description).toContain('description threat4');
        });

        it('adds the attack mechanism', () => {
            expect(tdThreats[0].description).toContain('CAPEC');
            expect(tdThreats[1].description).toContain('CAPEC');
            expect(tdThreats[2].description).not.toContain('CAPEC');
        });

        it('adds the weakness', () => {
            expect(tdThreats[0].description).toContain('CWE');
            expect(tdThreats[1].description).toContain('CWE');
            expect(tdThreats[2].description).not.toContain('CWE');
        });

        it('adds the source of threat', () => {
            expect(tdThreats[1].description).toContain('human error');
            expect(tdThreats[1].description).not.toContain('adversary');
            expect(tdThreats[3].description).toContain('events beyond org control');
            expect(tdThreats[3].description).toContain('adversary');
        });

        it('adds the threat persona', () => {
            expect(tdThreats[0].description).toContain('persona0');
            expect(tdThreats[4].description).toContain('persona4');
        });
    });

});
