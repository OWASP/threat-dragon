import { expect } from 'chai';
import sinon from 'sinon';

import PlausibleEnv from '../../src/env/Plausible.js';

const properties = [
    'PLAUSIBLE_ENABLED',
    'PLAUSIBLE_EVENT_URL',
    'PLAUSIBLE_DOMAIN',
    'PLAUSIBLE_DASHBOARD_URL',
    'PLAUSIBLE_ALLOW_INSECURE'
];

describe('env/Plausible.js', () => {
    let plausible;

    beforeEach(() => {
        plausible = new PlausibleEnv();
        plausible.logger = { warn: sinon.stub() };
    });

    afterEach(() => properties.forEach((property) => delete process.env[property]));

    it('uses the PLAUSIBLE_ prefix', () => {
        expect(plausible.prefix).to.equal('PLAUSIBLE_');
    });

    it('defaults analytics to disabled', () => {
        expect(plausible._loadConfig().PLAUSIBLE_ENABLED).to.equal(false);
    });

    it('accepts boolean configuration values', () => {
        process.env.PLAUSIBLE_ENABLED = 'false';
        process.env.PLAUSIBLE_ALLOW_INSECURE = false;
        const config = plausible._loadConfig();
        expect(config.PLAUSIBLE_ALLOW_INSECURE).to.equal(false);
    });

    it('warns when insecure connections are allowed while analytics is disabled', () => {
        process.env.PLAUSIBLE_ALLOW_INSECURE = 'true';
        plausible._loadConfig();
        expect(plausible.logger.warn).to.have.been.calledOnce;
    });

    it('rejects an invalid boolean value', () => {
        process.env.PLAUSIBLE_ENABLED = 'yes';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_ENABLED must be true or false');
    });

    it('requires an event URL when enabled', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_EVENT_URL is required');
    });

    it('rejects HTTP event URLs by default', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'http://plausible.test/api/event';
        process.env.PLAUSIBLE_DOMAIN = 'threatdragon.test';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'https://plausible.test/share/threatdragon';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_EVENT_URL must use HTTPS');
    });

    it('rejects malformed event URLs', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'not-a-url';
        process.env.PLAUSIBLE_DOMAIN = 'threatdragon.test';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'https://plausible.test/share/threatdragon';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_EVENT_URL must be a valid URL');
    });

    it('rejects event URLs with unsafe URL components', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'https://user@plausible.test/api/event?test=true';
        process.env.PLAUSIBLE_DOMAIN = 'threatdragon.test';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'https://plausible.test/share/threatdragon';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_EVENT_URL must not include credentials');
    });

    it('rejects dashboard URLs with fragments', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'https://plausible.test/api/event';
        process.env.PLAUSIBLE_DOMAIN = 'threatdragon.test';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'https://plausible.test/share/threatdragon#secret';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_DASHBOARD_URL must not include credentials');
    });

    it('rejects a domain containing a path', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'https://plausible.test/api/event';
        process.env.PLAUSIBLE_DOMAIN = 'threatdragon.test/path';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'https://plausible.test/share/threatdragon';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_DOMAIN must be a domain name');
    });

    it('rejects an invalid domain', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'https://plausible.test/api/event';
        process.env.PLAUSIBLE_DOMAIN = 'bad domain';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'https://plausible.test/share/threatdragon';
        expect(() => plausible._loadConfig()).to.throw('PLAUSIBLE_DOMAIN must be a domain name');
    });

    it('accepts a complete HTTPS configuration', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'https://plausible.test/api/event';
        process.env.PLAUSIBLE_DOMAIN = 'threatdragon.test';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'https://plausible.test/share/threatdragon';
        expect(plausible._loadConfig().PLAUSIBLE_DOMAIN).to.equal('threatdragon.test');
    });

    it('permits insecure testing configuration only when requested', () => {
        process.env.PLAUSIBLE_ENABLED = 'true';
        process.env.PLAUSIBLE_ALLOW_INSECURE = 'true';
        process.env.PLAUSIBLE_EVENT_URL = 'http://plausible.test/api/event';
        process.env.PLAUSIBLE_DOMAIN = 'localhost:8080';
        process.env.PLAUSIBLE_DASHBOARD_URL = 'http://plausible.test/share/threatdragon';
        plausible._loadConfig();
        expect(plausible.logger.warn).to.have.been.calledOnce;
    });
});
