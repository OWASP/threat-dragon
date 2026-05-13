import { expect } from 'chai';
import { isString, isNullish } from '../../src/helpers/validators.helper.js';

describe('validators.helper.js', () => {

    describe('isString', () => {
        it('returns true for strings', () => {
            expect(isString('hello')).to.be.true;
            expect(isString('')).to.be.true;
        });

        it('returns false for non-strings', () => {
            expect(isString(null)).to.be.false;
            expect(isString(undefined)).to.be.false;
            expect(isString(123)).to.be.false;
            expect(isString({})).to.be.false;
            expect(isString([])).to.be.false;
            expect(isString(true)).to.be.false;
        });

        it('returns false for String objects', () => {
            expect(isString(new String('hello'))).to.be.false;
        });
    });

    describe('isNullish', () => {
        it('returns true for null', () => {
            expect(isNullish(null)).to.be.true;
        });

        it('returns true for undefined', () => {
            expect(isNullish(undefined)).to.be.true;
        });

        it('returns false for non-nullish values', () => {
            expect(isNullish('')).to.be.false;
            expect(isNullish(0)).to.be.false;
            expect(isNullish(false)).to.be.false;
            expect(isNullish(NaN)).to.be.false;
            expect(isNullish({})).to.be.false;
        });
    });
});

