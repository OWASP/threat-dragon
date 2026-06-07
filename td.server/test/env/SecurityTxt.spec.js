import { expect } from 'chai';
import sinon from 'sinon';

import { Env } from '../../src/env/Env.js';
import SecurityTxt from '../../src/env/SecurityTxt.js';

describe('env/SecurityTxt.js', () => {
    let logger, securityTxtEnv;

    beforeEach(() => {
        securityTxtEnv = new SecurityTxt();
        logger = {
            error: sinon.stub(),
            info: sinon.stub(),
            warn: sinon.stub()
        };
        securityTxtEnv.logger = logger;
    });

    it('extends Env', () => {
        expect(securityTxtEnv).is.instanceOf(Env);
    });

    it('is named SecurityTxt', () => {
        expect(securityTxtEnv.name).to.eq('SecurityTxt');
    });

    it('uses the SECURITY_TXT_ prefix', () => {
        expect(securityTxtEnv.prefix).to.eq('SECURITY_TXT_');
    });

    it('has the optional property enabled', () => {
        const isRequired = securityTxtEnv.properties
            .find((x) => x.key === 'ENABLED')
            .required;
        expect(isRequired).to.be.false;
    });

    it('defaults enabled to false', () => {
        const defaultVal = securityTxtEnv.properties
            .find((x) => x.key === 'ENABLED')
            .defaultValue;
        expect(defaultVal).to.eq(false);
    });

    it('has the optional property contact', () => {
        const isRequired = securityTxtEnv.properties
            .find((x) => x.key === 'CONTACT')
            .required;
        expect(isRequired).to.be.false;
    });


    it('has the optional property policy', () => {
        const isRequired = securityTxtEnv.properties
            .find((x) => x.key === 'POLICY')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property canonical', () => {
        const isRequired = securityTxtEnv.properties
            .find((x) => x.key === 'CANONICAL')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property preferred languages', () => {
        const isRequired = securityTxtEnv.properties
            .find((x) => x.key === 'PREFERRED_LANGUAGES')
            .required;
        expect(isRequired).to.be.false;
    });

    it('has the optional property expires', () => {
        const isRequired = securityTxtEnv.properties
            .find((x) => x.key === 'CONTACT')
            .required;
        expect(isRequired).to.be.false;
    });

    describe('_loadConfig() validation', () => {
        const envVars = [
            'ENABLED',
            'CONTACT',
            'POLICY',
            'CANONICAL',
            'PREFERRED_LANGUAGES',
            'EXPIRES'
        ];

        const getConfigError = () => {
            let e;
            try {
                securityTxtEnv._loadConfig();
            } catch (err) {
                e = err;
            }
            return e;
        };

        afterEach(() => {
            envVars.forEach((env) => {
                delete process.env[`SECURITY_TXT_${env}`];
            });
        });

        it('does not throw when enabled is undefined', () => {
            expect(getConfigError()).to.be.undefined;
        });

        it('does not throw when enabled is false', () => {
            process.env.SECURITY_TXT_ENABLED = false;
            expect(getConfigError()).to.be.undefined;
        });

        it('does not log when enabled is false', () => {
            process.env.SECURITY_TXT_ENABLED = false;
            securityTxtEnv._loadConfig();
            expect(logger.error).not.to.have.been.called;
        });

        it('does not throw when enabled and required values are set', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_CONTACT = 'mailto:someone@somewhere.com';
            process.env.SECURITY_TXT_EXPIRES = new Date('2999-12-31').toISOString();
            expect(getConfigError()).to.be.undefined;
        });

        it('throws when enabled but contact is undefined', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_EXPIRES = (new Date()).toISOString();
            expect(getConfigError().message).to.contain('CONTACT');
        });

        it('logs when enabled but contact is undefined', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_EXPIRES = (new Date()).toISOString();
            getConfigError();
            expect(logger.error).to.have.been.calledWith(
                'When SECURITY_TXT_ENABLED is set to true, both SECURITY_TXT_CONTACT and SECURITY_TXT_EXPIRES are required'
            );
        });

        it('throws when enabled but expires is undefined', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_CONTACT = 'mailto:someone@somewhere.com';
            expect(getConfigError().message).to.contain('EXPIRE');
        });

        it('throws when expires is not a valid date string', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_CONTACT = 'mailto:someone@somewhere.com';
            process.env.SECURITY_TXT_EXPIRES = 'definitely not a date';
            expect(getConfigError().message).to.contain('must be a valid date');
        });

        it('logs when expires is not a valid date string', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_CONTACT = 'mailto:someone@somewhere.com';
            process.env.SECURITY_TXT_EXPIRES = 'definitely not a date';
            getConfigError();
            expect(logger.error).to.have.been.calledWith(
                'SECURITY_TXT_EXPIRES must be a valid date'
            );
        });

        it('logs a warning when expires is in the past', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_CONTACT = 'mailto:someone@somewhere.com';
            process.env.SECURITY_TXT_EXPIRES = new Date('2020-01-01').toISOString();
            securityTxtEnv._loadConfig();
            expect(logger.warn).to.have.been.calledWith(
                'Your security.txt has expired. SECURITY_TXT_EXPIRES date is in the past'
            );
        });

        it('logs information when expires is more than a year away', () => {
            process.env.SECURITY_TXT_ENABLED = true;
            process.env.SECURITY_TXT_CONTACT = 'mailto:someone@somewhere.com';
            process.env.SECURITY_TXT_EXPIRES = new Date('2999-12-31').toISOString();
            securityTxtEnv._loadConfig();
            expect(logger.info).to.have.been.calledWith(
                'Your security.txt expiration date is more than one year in the future.'
            );
        });
    });

});
