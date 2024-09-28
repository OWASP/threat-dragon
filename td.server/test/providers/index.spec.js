import { expect } from 'chai';
import sinon from 'sinon';

import bitbucket from '../../src/providers/bitbucket.js';
import github from '../../src/providers/github.js';
import providers from '../../src/providers/index.js';
import google from '../../src/providers/google.js';

describe('providers/index.js', () => {
    describe('all', () => {
        it('is an immutable object', () => {
            expect(() => { providers.all.foo = 'bar'; }).to.throw();
        });

        it('has the github provider', () => {
            expect(providers.all.github).not.to.be.undefined;
        });

        it('has the bitbucket provider', () => {
            expect(providers.all.bitbucket).not.to.be.undefined;
        });

        it('has the google provider', () => {
            expect(providers.all.google).not.to.be.undefined;
        });
    });

    describe('get', () => {
        it('gets a configured github provider', () => {
            sinon.stub(github, 'isConfigured').returns(true);
            expect(providers.get('github')).not.to.be.undefined;
        });

        it('gets a configured bitbucket provider', () => {
            sinon.stub(bitbucket, 'isConfigured').returns(true);
            expect(providers.get('bitbucket')).not.to.be.undefined;
        });

        it('gets a configured google provider', () => {
            sinon.stub(google, 'isConfigured').returns(true);
            expect(providers.get('google')).not.to.be.undefined;
        });

        it('errors with an unknown provider', () => {
            expect(() => providers.get('foobar')).to.throw();
        });

        it('errors with an undefined provider', () => {
            expect(() => providers.get()).to.throw();
        });

        it('errors with an unconfigured github provider', () => {
            sinon.stub(github, 'isConfigured').returns(false);
            expect(() => providers.get('github')).to.throw();
        });

        it('errors with an unconfigured bitbucket provider', () => {
            sinon.stub(bitbucket, 'isConfigured').returns(false);
            expect(() => providers.get('bitbucket')).to.throw();
        });

        it('errors with an unconfigured google provider', () => {
            sinon.stub(google, 'isConfigured').returns(false);
            expect(() => providers.get('google')).to.throw();
        });
    });
});
