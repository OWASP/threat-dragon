import { expect } from 'chai';

import { errorCodes } from '../../src/constants/errorCodes.js';
import { errorMessages } from '../../src/constants/errorMessages.js';

const codeValues = Object.values(errorCodes);

describe('constants/errorCodes.js', () => {
    it('defines each error code as a string equal to its key', () => {
        Object.entries(errorCodes).forEach(([key, value]) => {
            expect(key).to.equal(value);
        });
    });

    it('follows the CONFIG_ naming convention', () => {
        Object.keys(errorCodes).forEach((key) => {
            expect(key).to.match(/^CONFIG_[A-Z0-9_]+$/);
        });
    });

    it('is frozen and cannot be mutated', () => {
        expect(Object.isFrozen(errorCodes)).to.be.true;
    });
});

describe('constants/errorMessages.js', () => {
    it('has a non-empty message for every ERROR_CODES entry', () => {
        codeValues.forEach((code) => {
            expect(errorMessages[code]).to.be.a('string').with.length.greaterThan(0);
        });
    });

    it('does not define messages for non-existent codes', () => {
        Object.keys(errorMessages).forEach((key) => {
            expect(codeValues).to.include(key);
        });
    });

    it('defines messages for all and only ERROR_CODES', () => {
        const messageKeys = Object.keys(errorMessages);
        expect(messageKeys.sort()).to.deep.equal([...codeValues].sort());
    });

    it('is frozen and cannot be mutated', () => {
        expect(Object.isFrozen(errorMessages)).to.be.true;
    });
});
