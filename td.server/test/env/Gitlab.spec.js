import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import Gitlab from '../../src/env/Gitlab.js';

describe('env/Gitlab.js', () => {
    let gitlabEnv;

    beforeEach(() => {
        gitlabEnv = new Gitlab();
    });

    it('extends Env', () => {
        expect(gitlabEnv).is.instanceOf(Env);
    });

    it('is named bitbucket', () => {
        expect(gitlabEnv.name).to.eq('Gitlab');
    });

    it('uses the GITLAB_ prefix', () => {
        expect(gitlabEnv.prefix).to.eq('GITLAB_');
    });

    it('has the optional property CLIENT_ID', () => {
        const isRequired = gitlabEnv.properties
            .find(x => x.key === 'CLIENT_ID')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property CLIENT_SECRET', () => {
        const isRequired = gitlabEnv.properties
            .find(x => x.key === 'CLIENT_SECRET')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property SCOPE', () => {
        const isRequired = gitlabEnv.properties
            .find(x => x.key === 'SCOPE')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has a default value for property SCOPE', () => {
        const value = gitlabEnv.properties
            .find(x => x.key === 'SCOPE')
            .defaultValue;
        expect(value).to.equal('read_user read_repository');
    });

    it('has the optional property HOST', () => {
        const isRequired = gitlabEnv.properties
            .find(x => x.key === 'HOST')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property REDIRECT_URI', () => {
        const isRequired = gitlabEnv.properties
            .find(x => x.key === 'REDIRECT_URI')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property REPO_ROOT_DIRECTORY', () => {
        const isRequired = gitlabEnv.properties
            .find(x => x.key === 'REPO_ROOT_DIRECTORY')
            .required;
        expect(isRequired).to.be.false;
    });
});
