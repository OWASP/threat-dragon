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
});
