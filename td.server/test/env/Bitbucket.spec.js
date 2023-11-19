import Bitbucket from '../../src/env/Bitbucket.js';

import { expect } from 'chai';
import { Env } from '../../src/env/Env.js';

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

    it('has the optional property WORKSPACE', () => {
        const isRequired = bitbucketEnv.properties
            .find(x => x.key === 'WORKSPACE')
            .required;
        expect(isRequired).to.be.false;
    });
});
