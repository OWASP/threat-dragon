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

    it('has the optional property LOG_MAX_FILE_SIZE', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'LOG_MAX_FILE_SIZE')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the required property LOG_LEVEL', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'LOG_LEVEL')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property SERVER_API_PROTOCOL', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'SERVER_API_PROTOCOL')
            .required;
        expect(isRequired).to.be.false;
    });
});
