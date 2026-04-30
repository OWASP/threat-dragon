import controls from '@/service/migration/tmBom/diagrams/threats/controls';
import assumptions from '@/service/migration/tmBom/diagrams/assumptions';
import risks from '@/service/migration/tmBom/diagrams/threats/risks';
import {findThreats } from '@/service/migration/tmBom/diagrams/threats/threats';
import tmBom from '../../test-model';
//import { threats as mockThreats } from './mockTdThreats.json';

jest.mock('@/service/migration/tmBom/diagrams/threats/controls');
controls.merge.mockImplementation((_model, threats) => threats);
jest.mock('@/service/migration/tmBom/diagrams/assumptions');
assumptions.merge.mockImplementation((_model, threats) => threats);
jest.mock('@/service/migration/tmBom/diagrams/threats/risks');
risks.merge.mockImplementation((_model, threats) => threats);

describe('service/migration/tmBom/diagrams/threats/threats.js', () => {

    describe('findThreats', () => {
	    let tdThreats = findThreats(tmBom);

	    it('finds the threats', () => {
	        expect(tdThreats).toHaveLength(tmBom.threats.length);
	    });
    });

});
