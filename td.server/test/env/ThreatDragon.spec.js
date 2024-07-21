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

    it('has a default value for property NODE_ENV', () => {
        const value = tdEnv.properties
            .find(x => x.key === 'NODE_ENV')
            .defaultValue;
        expect(value).to.equal('production');
    });

    it('has the optional property PORT', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'PORT')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property PORT', () => {
        const value = tdEnv.properties
            .find(x => x.key === 'PORT')
            .defaultValue;
        expect(value).to.equal(3000);
    });

    it('has the optional property LOG_MAX_FILE_SIZE', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'LOG_MAX_FILE_SIZE')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property LOG_MAX_FILE_SIZE', () => {
        const value = tdEnv.properties
            .find(x => x.key === 'LOG_MAX_FILE_SIZE')
            .defaultValue;
        expect(value).to.equal(24);
    });

    it('has the required property LOG_LEVEL', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'LOG_LEVEL')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property LOG_LEVEL', () => {
        const value = tdEnv.properties
            .find(x => x.key === 'LOG_LEVEL')
            .defaultValue;
        expect(value).to.equal('warn');
    });

    it('has the optional property SERVER_API_PROTOCOL', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'SERVER_API_PROTOCOL')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property SERVER_API_PROTOCOL', () => {
        const value = tdEnv.properties
            .find(x => x.key === 'SERVER_API_PROTOCOL')
            .defaultValue;
        expect(value).to.equal('https');
    });

    it('has the optional property REPO_ROOT_DIRECTORY', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'REPO_ROOT_DIRECTORY')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property REPO_ROOT_DIRECTORY', () => {
        const value = tdEnv.properties
            .find(x => x.key === 'REPO_ROOT_DIRECTORY')
            .defaultValue;
        expect(value).to.equal('ThreatDragonModels');
    });

    it('has the optional property REPO_USE_SEARCH', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'REPO_USE_SEARCH')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property REPO_USE_SEARCH', () => {
        const value = tdEnv.properties
            .find(x => x.key === 'REPO_USE_SEARCH')
            .defaultValue;
        expect(value).to.be.false;
    });

    it('has the optional property REPO_SEARCH_QUERY', () => {
        const isRequired = tdEnv.properties
            .find(x => x.key === 'REPO_SEARCH_QUERY')
            .required;
        expect(isRequired).to.be.false;
    });
});
