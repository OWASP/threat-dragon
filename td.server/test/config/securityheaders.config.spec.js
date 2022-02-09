import { expect } from 'chai';
import helmet from 'helmet';
import sinon from 'sinon';

import { getMockApp } from '../mocks/express.mocks.js';
import securityHeaders from '../../src/config/securityheaders.config.js';

describe('config/securityHeaders.config.js', () => {
    let mockApp;

    beforeEach(() => {
        mockApp = getMockApp();
        sinon.stub(helmet, 'hsts');
        sinon.stub(helmet, 'frameguard');
        sinon.stub(helmet, 'hidePoweredBy');
        sinon.stub(helmet, 'noSniff');
        sinon.stub(helmet, 'xssFilter');
        sinon.stub(helmet, 'referrerPolicy');
        sinon.stub(helmet, 'contentSecurityPolicy');
        securityHeaders.config(mockApp, true);
    });

    it('removes the x-powered-by header', () => {
        expect(mockApp.set).to.have.been.calledWith('x-powered-by', false);
    });

    it('applies the HSTS', () => {
        const expectedCfg = {
            maxAge: 7776000,
            force: true,
            includeSubDomains: false
        };
        expect(helmet.hsts).to.have.been.calledWith(expectedCfg);
    });

    it('applies the frameguard', () => {
        expect(helmet.frameguard).to.have.been.calledWith({ action: 'deny' });
    });

    it('removes the powered by using helmet', () => {
        expect(helmet.hidePoweredBy).to.have.been.calledOnce;
    });

    it('adds noSniff', () => {
        expect(helmet.noSniff).to.have.been.calledOnce;
    });

    it('adds an xss filter', () => {
        expect(helmet.xssFilter).to.have.been.calledOnce;
    });

    it('adds the referrer policy', () => {
        const expected = {
            policy: 'strict-origin-when-cross-origin'
        };
        expect(helmet.referrerPolicy).to.have.been.calledWith(expected);
    });

    it('adds a CSP', () => {
        expect(helmet.contentSecurityPolicy).to.have.been.calledWith(sinon.match.object);
    });
});
