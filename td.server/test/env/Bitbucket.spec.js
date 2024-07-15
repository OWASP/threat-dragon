import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import Bitbucket from '../../src/env/Bitbucket.js';

describe('env/Bitbucket.js', () => {
    let bitbucketEnv;

    beforeEach(() => {
        bitbucketEnv = new Bitbucket();
    });

    it('extends Env', () => {
        expect(bitbucketEnv).is.instanceOf(Env);
    });

    it('is named bitbucket', () => {
        expect(bitbucketEnv.name).to.eq('Bitbucket');
    });

    it('uses the BITBUCKET_ prefix', () => {
        expect(bitbucketEnv.prefix).to.eq('BITBUCKET_');
    });

    it('has the optional property CLIENT_ID', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'CLIENT_ID')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property CLIENT_SECRET', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'CLIENT_SECRET')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property SCOPE', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'SCOPE')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property SCOPE', () => {
        const value = bitbucketEnv.properties
            .find(x => x.key === 'SCOPE')
            .defaultValue;
        expect(value).to.equal('repository:read');
    });

    it('has the optional property ENTERPRISE_HOSTNAME', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'ENTERPRISE_HOSTNAME')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property ENTERPRISE_PORT', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'ENTERPRISE_PORT')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property ENTERPRISE_PORT', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'ENTERPRISE_PORT')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property ENTERPRISE_PROTOCOL', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'ENTERPRISE_PROTOCOL')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property ENTERPRISE_PROTOCOL', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'ENTERPRISE_PROTOCOL')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property WORKSPACE', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'WORKSPACE')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property REPO_ROOT_DIRECTORY', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'REPO_ROOT_DIRECTORY')
            .required;
        expect(isRequired).to.be.false;
    });
});
