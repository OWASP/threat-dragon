import { expect } from 'chai';

import { ERROR_CODES } from '../../src/constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../src/constants/errorMessages.js';

const codeValues = Object.values(ERROR_CODES);

describe('constants/errorCodes.js', () => {
    it('defines each error code as a string equal to its key', () => {
        Object.entries(ERROR_CODES).forEach(([key, value]) => {
            expect(key).to.equal(value);
        });
    });

    it('follows the CONFIG_ naming convention', () => {
        Object.keys(ERROR_CODES).forEach((key) => {
            expect(key).to.match(/^CONFIG_[A-Z0-9_]+$/);
        });
    });

    it('is frozen and cannot be mutated', () => {
        expect(Object.isFrozen(ERROR_CODES)).to.be.true;
    });
});

describe('constants/errorMessages.js', () => {
    it('has a non-empty message for every ERROR_CODES entry', () => {
        codeValues.forEach((code) => {
            expect(ERROR_MESSAGES[code]).to.be.a('string').with.length.greaterThan(0);
        });
    });

    it('does not define messages for non-existent codes', () => {
        Object.keys(ERROR_MESSAGES).forEach((key) => {
            expect(codeValues).to.include(key);
        });
    });

    it('defines messages for all and only ERROR_CODES', () => {
        const messageKeys = Object.keys(ERROR_MESSAGES);
        expect(messageKeys.sort()).to.deep.equal([...codeValues].sort());
    });

    it('is frozen and cannot be mutated', () => {
        expect(Object.isFrozen(ERROR_MESSAGES)).to.be.true;
    });
});
