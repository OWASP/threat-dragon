import { expect } from 'chai';
import sinon from 'sinon';
import jwtHelper from '../../src/helpers/jwt.helper.js';
import tokenRepo from '../../src/repositories/token.js';
import tokenStore from '../../src/repositories/tokenStore.js';

describe('repositories/token.js', () => {
    const token = 'foo';

    afterEach(() => {
        tokenRepo.remove(token);
        sinon.restore();
    });

    describe('add', () => {
        it('adds a token', () => {
            // Spy on the tokenStore add method
            const addSpy = sinon.spy(tokenStore, 'add');

            // Add a token
            tokenRepo.add(token);

            // Verify the add method was called
            expect(addSpy).to.have.been.calledWith(token);

            // Verify the token was added
            sinon.stub(jwtHelper, 'verifyRefresh').returns(true);
            expect(tokenRepo.verify(token)).to.be.true;
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            tokenRepo.add(token);
        });

        it('should remove the token', () => {
            // Spy on the tokenStore remove method
            const removeSpy = sinon.spy(tokenStore, 'remove');

            // Remove the token
            tokenRepo.remove(token);

            // Verify the remove method was called
            expect(removeSpy).to.have.been.calledWith(token);

            // Verify the token was removed
            expect(tokenRepo.verify(token)).to.be.false;
        });

        it('should not error if the token is not present', () => {
            // Spy on the tokenStore remove method
            const removeSpy = sinon.spy(tokenStore, 'remove');

            // Remove a token that doesn't exist
            tokenRepo.remove('fake');

            // Verify the remove method was called
            expect(removeSpy).to.have.been.calledWith('fake');

            // Verify the token verification fails
            expect(tokenRepo.verify('fake')).to.be.false;
        });
    });

    describe('verify', () => {
        describe('with a valid token', () => {
            beforeEach(() => {
                tokenRepo.add(token);
                sinon.stub(jwtHelper, 'verifyRefresh').returns(true);
            });

            it('verifies the token', () => {
                // Spy on the tokenStore verify method
                const verifySpy = sinon.spy(tokenStore, 'verify');

                // Verify the token
                expect(tokenRepo.verify(token)).to.be.true;

                // Verify the verify method was called
                expect(verifySpy).to.have.been.calledWith(token);
            });
        });

        describe('with an invalid token', () => {
            beforeEach(() => {
                tokenRepo.add(token);
                sinon.stub(jwtHelper, 'verifyRefresh').throws();
            });

            it('returns false and removes the token', () => {
                // Verify the token
                expect(tokenRepo.verify(token)).to.be.false;

                // Verify the token was removed (subsequent verification fails)
                sinon.restore();
                sinon.stub(jwtHelper, 'verifyRefresh').returns(true);
                expect(tokenRepo.verify(token)).to.be.false;
            });
        });

        describe('with a non-existing token', () => {
            it('returns false', () => {
                // Spy on the tokenStore verify method
                const verifySpy = sinon.spy(tokenStore, 'verify');

                // Verify a token that doesn't exist
                expect(tokenRepo.verify(token)).to.be.false;

                // Verify the verify method was called
                expect(verifySpy).to.have.been.calledWith(token);
            });
        });
    });
});
