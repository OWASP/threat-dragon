import { expect } from 'chai';
import sinon from 'sinon';

import jwtHelper from '../../src/helpers/jwt.helper.js';
import { logger } from '../../src/config/loggers.config.js';
import tokenRepo from '../../src/repositories/token.js';

describe('repositories/token.js', () => {
    const token = 'foo';

    beforeEach(() => {
        sinon.stub(logger, 'info');
    });

    afterEach(() => {
        tokenRepo.remove(token);
        sinon.restore();
    });

    describe('add', () => {
        it('adds a token', () => {
            sinon.stub(jwtHelper, 'verifyRefresh').returns(true);
            tokenRepo.add(token);
            expect(tokenRepo.verify(token)).to.be.true;
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            tokenRepo.add(token);
        });

        it('should remove the token', () => {
            tokenRepo.remove(token);
            expect(tokenRepo.verify(token)).to.be.false;
        });

        it('should not error if the token is not present', () => {
            tokenRepo.remove('fake');
            expect(tokenRepo.verify('fake')).to.be.false;
        });
    });

    describe('verify', () => {
        describe('with a valid token', () => {
            beforeEach(() => {
                tokenRepo.add(token);
                sinon.stub(jwtHelper, 'verifyRefresh');
            });

            it('verifies the token', () => {
                expect(tokenRepo.verify(token)).to.be.true;
            });
        });

        describe('with an invalid token', () => {
            beforeEach(() => {
                tokenRepo.add(token);
                sinon.stub(jwtHelper, 'verifyRefresh').throws();
            });

            it('verifies the token', () => {
                expect(tokenRepo.verify(token)).to.be.false;
            });
        });

        describe('with a non-existing token', () => {
            it('returns false', () => {
                expect(tokenRepo.verify(token)).to.be.false;
            });
        });
    });
});
