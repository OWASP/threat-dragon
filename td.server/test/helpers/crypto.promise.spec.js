import crypto from 'crypto';
import { expect } from 'chai';
import sinon from 'sinon';

import cryptoPromise from '../../src/helpers/crypto.promise.js';

describe('helpers/crypto.promise.js', () => {
    describe('randomBytes', () => {
        const rand = 'asdfasdfasdf';
        const reject = (num, cb) => { cb('some error'); };
        const resolve = (num, cb) => { cb(null, rand); };

        it('returns a promise', () => {
            expect(cryptoPromise.randomBytes()).to.be.a('Promise');
        });

        it('rejects when crypto throws an error', async () => {
            sinon.stub(crypto, 'randomBytes').callsFake(reject);
            expect(cryptoPromise.randomBytes(15)).eventually.be.rejected;
        });

        it('resolves the promise', async () => {
            sinon.stub(crypto, 'randomBytes').callsFake(resolve);
            expect(cryptoPromise.randomBytes(14)).to.eventually.eq(rand);
        });
    });
});
