import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import ThreatDragonEnv from '../../src/env/ThreatDragon.js';

describe('env/ThreatDragon.js', () => {
    let tdEnv;

    beforeEach(() => {
        tdEnv = new ThreatDragonEnv();
    });

    it('extends Env', () => {
        expect(tdEnv).is.instanceOf(Env);
    });

    it('is named ThreatDragon', () => {
        expect(tdEnv.name).to.eq('ThreatDragon');
    });

    it('uses the an empty prefix', () => {
        expect(tdEnv.prefix).to.eq('');
    });

    it('has the optional property NODE_ENV', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'NODE_ENV')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property PORT', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'PORT')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property IS_TEST', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'IS_TEST')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the required property JWT_SIGNING_KEY', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'JWT_SIGNING_KEY')
            .required;
        expect(isRequired).to.be.true;
    });
});
