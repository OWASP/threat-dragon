import { expect } from 'chai';
import sinon from 'sinon';

import github from '../../src/providers/github.js';
import providers from '../../src/providers/index.js';

describe('providers/index.js', () => {
    describe('all', () => {
        it('is an immutable object', () => {
            expect(() => { providers.all.foo = 'bar'; }).to.throw();
        });

        it('has the github provider', () => {
            expect(providers.all.github).not.to.be.undefined;
        });
    });

    describe('get', () => {
        it('gets a configured provider', () => {
            sinon.stub(github, 'isConfigured').returns(true);
            expect(providers.get('github')).not.to.be.undefined;
        });

        it('errors with an unknown provider', () => {
            expect(() => providers.get('foobar')).to.throw();
        });

        it('errors with an undefined provider', () => {
            expect(() => providers.get()).to.throw();
        });

        it('errors with an unconfigured provider', () => {
            sinon.stub(github, 'isConfigured').returns(false);
            expect(() => providers.get('github')).to.throw();
        });
    });
});
