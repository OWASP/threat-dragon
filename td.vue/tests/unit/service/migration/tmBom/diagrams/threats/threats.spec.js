import controls from '@/service/migration/tmBom/diagrams/threats/controls';
import assumptions from '@/service/migration/tmBom/diagrams/assumptions';
import risks from '@/service/migration/tmBom/diagrams/threats/risks';
import threats from '@/service/migration/tmBom/diagrams/threats/threats';
import tmBom from '../../tmbom-test-model';
//import { threats as mockThreats } from './mockTdThreats.json';

jest.mock('@/service/migration/tmBom/diagrams/threats/controls');
controls.merge.mockImplementation((_model, threats) => threats);
jest.mock('@/service/migration/tmBom/diagrams/assumptions');
assumptions.merge.mockImplementation((_model, threats) => threats);
jest.mock('@/service/migration/tmBom/diagrams/threats/risks');
risks.merge.mockImplementation((_model, threats) => threats);

describe('service/migration/tmBom/diagrams/threats/threats.js', () => {

    describe('findThreats', () => {
        let tdThreats = threats.merge(tmBom);

        it('finds the threats', () => {
            expect(tdThreats).toHaveLength(tmBom.threats.length);
        });

        it('copies the id', () => {
            expect(tdThreats[0].id).toEqual(tmBom.threats[0].symbolic_name);
            expect(tdThreats[4].id).toEqual(tmBom.threats[4].symbolic_name);
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
