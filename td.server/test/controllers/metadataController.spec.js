import { expect } from 'chai';
import sinon from 'sinon';

import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';
import env from '../../src/env/Env.js';
import errors from '../../src/controllers/errors.js';
import metadataController from '../../src/controllers/metadataController.js';

describe('controllers/metadataController.js', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = getMockRequest();
        mockResponse = getMockResponse();
        mockResponse.set = sinon.stub().returns(mockResponse);
    });

    describe('securityTxt', () => {
        it('returns not found when security.txt is not enabled', () => {
            sinon.stub(env, 'get').returns({
                config: {
                    SECURITY_TXT_ENABLED: false
                }
            });
            sinon.stub(errors, 'notFound');

            metadataController.securityTxt(mockRequest, mockResponse);

            expect(errors.notFound).to.have.been.calledWith('File not found', mockResponse);
        });

        it('sets the text content type when security.txt is enabled', () => {
            sinon.stub(env, 'get').returns({
                config: {
                    SECURITY_TXT_ENABLED: true,
                    SECURITY_TXT_CONTACT: 'mailto:someone@somewhere.com',
                    SECURITY_TXT_EXPIRES: '2026-12-31T00:00:00.000Z'
                }
            });

            metadataController.securityTxt(mockRequest, mockResponse);

            expect(mockResponse.set).to.have.been.calledWith('Content-Type', 'text/plain; charset=utf-8');
        });

        it('returns security.txt with required values', () => {
            sinon.stub(env, 'get').returns({
                config: {
                    SECURITY_TXT_ENABLED: true,
                    SECURITY_TXT_CONTACT: 'mailto:someone@somewhere.com',
                    SECURITY_TXT_EXPIRES: '2026-12-31T00:00:00.000Z'
                }
            });

            metadataController.securityTxt(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith(
                [
                    'Contact: mailto:someone@somewhere.com',
                    'Expires: 2026-12-31T00:00:00.000Z'
                ].join('\n')
            );
        });

        it('returns security.txt with optional values', () => {
            sinon.stub(env, 'get').returns({
                config: {
                    SECURITY_TXT_ENABLED: true,
                    SECURITY_TXT_CONTACT: 'mailto:someone@somewhere.com',
                    SECURITY_TXT_EXPIRES: '2026-12-31T00:00:00.000Z',
                    SECURITY_TXT_POLICY: 'https://example.com/policy',
                    SECURITY_TXT_CANONICAL: 'https://example.com/.well-known/security.txt',
                    SECURITY_TXT_PREFERRED_LANGUAGES: 'en,es'
                }
            });

            metadataController.securityTxt(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith(
                [
                    'Contact: mailto:someone@somewhere.com',
                    'Expires: 2026-12-31T00:00:00.000Z',
                    'Policy: https://example.com/policy',
                    'Canonical: https://example.com/.well-known/security.txt',
                    'Preferred-Languages: en,es'
                ].join('\n')
            );
        });

        it('returns multiple contacts in order', () => {
            sinon.stub(env, 'get').returns({
                config: {
                    SECURITY_TXT_ENABLED: true,
                    SECURITY_TXT_CONTACT: 'mailto:one@somewhere.com, mailto:two@somewhere.com',
                    SECURITY_TXT_EXPIRES: '2026-12-31T00:00:00.000Z'
                }
            });

            metadataController.securityTxt(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith(
                [
                    'Contact: mailto:one@somewhere.com',
                    'Contact: mailto:two@somewhere.com',
                    'Expires: 2026-12-31T00:00:00.000Z'
                ].join('\n')
            );
        });

        it('sets the response status', () => {
            sinon.stub(env, 'get').returns({
                config: {
                    SECURITY_TXT_ENABLED: true,
                    SECURITY_TXT_CONTACT: 'mailto:someone@somewhere.com',
                    SECURITY_TXT_EXPIRES: '2026-12-31T00:00:00.000Z'
                }
            });

            metadataController.securityTxt(mockRequest, mockResponse);

            expect(mockResponse.status).to.have.been.calledWith(200);
        });
    });

    describe('legacySecurityTxtRedirect', () => {
        it('redirects to the well-known security.txt', () => {
            metadataController.legacySecurityTxtRedirect(mockRequest, mockResponse);

            expect(mockResponse.redirect).to.have.been.calledWith('/.well-known/security.txt');
        });
    });
});
