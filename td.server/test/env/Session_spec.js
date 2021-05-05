import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import SessionEnv from '../../src/env/Session.js';

describe('env/Session.js', () => {
    let sessionEnv;

    beforeEach(() => {
        sessionEnv = new SessionEnv();
    });

    it('extends Env', () => {
        expect(sessionEnv).is.instanceOf(Env);
    });

    it('is named session', () => {
        expect(sessionEnv.name).to.eq('Session');
    });

    it('uses the SESSION_ prefix', () => {
        expect(sessionEnv.prefix).to.eq('SESSION_');
    });

    it('has the required property STORE', () => {
        const isRequired = sessionEnv.properties
            .find(x => x.key === 'STORE')
            .required;
        expect(isRequired).to.be.true;
    });

    it('has the required property SIGNING_KEY', () => {
        const isRequired = sessionEnv.properties
            .find(x => x.key === 'SIGNING_KEY')
            .required;
        expect(isRequired).to.be.true;
    });

    it('has the required property ENCRYPTION_KEYS', () => {
        const isRequired = sessionEnv.properties
            .find(x => x.key === 'ENCRYPTION_KEYS')
            .required;
        expect(isRequired).to.be.true;
    });
});
