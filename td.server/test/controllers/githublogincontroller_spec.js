import { expect } from 'chai';
import sinon from 'sinon';

import githubLoginController from '../../src/controllers/githublogincontroller.js';
import provider from '../../src/providers/github.js';

describe('controllers/githublogincontroller.js', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('login', () => {
        beforeEach(() => {
            sinon.stub(provider, 'getOauthRedirectUrl');
            githubLoginController.login();
        });

        it('gets the oauth redirect url', () => {

        });
    });
});