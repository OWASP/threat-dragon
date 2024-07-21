import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import Github from '../../src/env/Github.js';

describe('env/Github.js', () => {
    let githubEnv;

    beforeEach(() => {
        githubEnv = new Github();
    });

    it('extends Env', () => {
        expect(githubEnv).is.instanceOf(Env);
    });

    it('is named github', () => {
        expect(githubEnv.name).to.eq('Github');
    });

    it('uses the GITHUB_ prefix', () => {
        expect(githubEnv.prefix).to.eq('GITHUB_');
    });

    it('has the optional property CLIENT_ID', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'CLIENT_ID')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property CLIENT_SECRET', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'CLIENT_SECRET')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property SCOPE', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'SCOPE')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property SCOPE', () => {
        const value = githubEnv.properties
            .find(x => x.key === 'SCOPE')
            .defaultValue;
        expect(value).to.equal('public_repo');
    });

    it('has the optional property ENTERPRISE_HOSTNAME', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'ENTERPRISE_HOSTNAME')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property ENTERPRISE_PORT', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'ENTERPRISE_PORT')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property ENTERPRISE_PORT', () => {
        const value = githubEnv.properties
            .find(x => x.key === 'ENTERPRISE_PORT')
            .defaultValue;
        expect(value).to.equal(443);
    });

    it('has the optional property ENTERPRISE_PROTOCOL', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'ENTERPRISE_PROTOCOL')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property ENTERPRISE_PROTOCOL', () => {
        const value = githubEnv.properties
            .find(x => x.key === 'ENTERPRISE_PROTOCOL')
            .defaultValue;
        expect(value).to.equal('https');
    });

    it('has the optional property USE_SEARCH', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'USE_SEARCH')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property USE_SEARCH', () => {
        const value = githubEnv.properties
            .find(x => x.key === 'USE_SEARCH')
            .defaultValue;
        expect(value).to.be.false;
    });

    it('has the optional property SEARCH_QUERY', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'SEARCH_QUERY')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property REPO_ROOT_DIRECTORY', () => {
        const isRequired = githubEnv.properties
            .find(x => x.key === 'REPO_ROOT_DIRECTORY')
            .required;
        expect(isRequired).to.be.false;
    });
});
