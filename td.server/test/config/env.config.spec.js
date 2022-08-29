import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import envConfig from '../../src/config/env.config.js';
import GithubEnv from '../../src/env/Github.js';
import EncryptionEnv from '../../src/env/Encryption.js';
import ThreatDragonEnv from '../../src/env/ThreatDragon.js';

describe('config/env.config.js environment configuration', () => {
    const mockEnv = {
        addProvider: () => {},
        hydrate: () => {}
    };

    beforeEach(function() {
        sinon.stub(env, 'get').returns(mockEnv);
        sinon.spy(mockEnv, 'addProvider');
        sinon.spy(mockEnv, 'hydrate');
        envConfig.tryLoadDotEnv();
    });

    describe('tryLoadDotEnv', () => {
        it('adds a github provider', () => {
            expect(mockEnv.addProvider).to.have.been
            .calledWith(sinon.match.instanceOf(GithubEnv));
        });

        it('adds the encryption provider', () => {
            expect(mockEnv.addProvider).to.have.been
            .calledWith(sinon.match.instanceOf(EncryptionEnv));
        });

        it('adds the threat dragon provider', () => {
            expect(mockEnv.addProvider).to.have.been
            .calledWith(sinon.match.instanceOf(ThreatDragonEnv));
        });

        it('hydrates the config', () => {
            expect(mockEnv.hydrate).to.have.been.calledOnce;
        });
    });
});