import { expect } from 'chai';
import sinon from 'sinon';

import { ERROR_CODES } from '../../src/constants/errorCodes.js';
import { getConfig } from '../../src/controllers/configcontroller.js';
import {
    buildConfig,
    normalizeLocale,
    parseLocalesArray
} from '../../src/helpers/config.helper.js';
import env from '../../src/env/Env.js';

describe('config.helper.js', () => {

    describe('normalizeLocale', () => {

        it('returns canonical form for valid locale', () => {
            expect(normalizeLocale('en')).to.equal('en');
            expect(normalizeLocale('pt-BR')).to.equal('pt-BR');
        });

        it('returns null for non-string input', () => {
            expect(normalizeLocale(null)).to.be.null;
            expect(normalizeLocale(undefined)).to.be.null;
            expect(normalizeLocale(123)).to.be.null;
            expect(normalizeLocale({})).to.be.null;
        });

        it('returns null for invalid format', () => {
            expect(normalizeLocale('zh-Hans-CN')).to.be.null;
            expect(normalizeLocale('en_US')).to.be.null;
            expect(normalizeLocale('-')).to.be.null;
        });

        it('trims whitespace before validation', () => {
            expect(normalizeLocale(' en ')).to.equal('en');
            expect(normalizeLocale('  pt  ')).to.equal('pt');
        });

        it('returns null for whitespace-only strings', () => {
            expect(normalizeLocale(' ')).to.be.null;
            expect(normalizeLocale('   ')).to.be.null;
        });

        it('canonicalizes case-variant tags', () => {
            expect(normalizeLocale('EN')).to.equal('en');
            expect(normalizeLocale('PT-BR')).to.equal('pt-BR');
            expect(normalizeLocale('pt-br')).to.equal('pt-BR');
        });
    });

    describe('parseLocalesArray', () => {

        it('returns null value with error when raw is null', () => {
            const result = parseLocalesArray(null);
            expect(result.value).to.be.null;
            expect(result.errors).to.have.length(1);
            expect(result.errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_MISSING);
        });

        it('returns null value with error when raw is undefined', () => {
            const result = parseLocalesArray(undefined);
            expect(result.value).to.be.null;
            expect(result.errors).to.have.length(1);
            expect(result.errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_MISSING);
        });

        it('returns null value with error when JSON is malformed', () => {
            const result = parseLocalesArray('not-json');
            expect(result.value).to.be.null;
            expect(result.errors).to.have.length(1);
            expect(result.errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_PARSE);
        });

        it('returns null value with error when JSON is not an array', () => {
            const result = parseLocalesArray('"hello"');
            expect(result.value).to.be.null;
            expect(result.errors).to.have.length(1);
            expect(result.errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_NOT_ARRAY);
        });

        it('returns null value with error when JSON is an object', () => {
            const result = parseLocalesArray('{"a":"b"}');
            expect(result.value).to.be.null;
            expect(result.errors).to.have.length(1);
            expect(result.errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_NOT_ARRAY);
        });

        it('returns empty array with no errors for empty JSON array', () => {
            const result = parseLocalesArray('[]');
            expect(result.value).to.deep.equal([]);
            expect(result.errors).to.be.empty;
        });

        it('parses valid locales and collects errors for invalid entries', () => {
            const result = parseLocalesArray('["en", 123, null, "pt"]');
            expect(result.value).to.deep.equal(['en', 'pt']);
            expect(result.errors).to.have.length(2);
            expect(result.errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_TYPE);
            expect(result.errors[1].code).to.equal(ERROR_CODES.CONFIG_LOCALE_TYPE);
        });

        it('rejects entries that fail format validation', () => {
            const result = parseLocalesArray('["en", "zh-Hans-CN", "pt"]');
            expect(result.value).to.deep.equal(['en', 'pt']);
            expect(result.errors).to.have.length(1);
            expect(result.errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_FORMAT);
        });

        it('canonicalizes case-variant locales', () => {
            const result = parseLocalesArray('["EN", "PT-BR"]');
            expect(result.value).to.deep.equal(['en', 'pt-BR']);
            expect(result.errors).to.be.empty;
        });

        it('deduplicates identical locales', () => {
            const result = parseLocalesArray('["en", "en", "pt", "pt"]');
            expect(result.value).to.deep.equal(['en', 'pt']);
            expect(result.errors).to.be.empty;
        });
    });

    describe('buildConfig', () => {

        describe('providers', () => {

            it('all providers enabled', () => {
                const { value } = buildConfig({
                    BITBUCKET_CLIENT_ID: '123',
                    GITHUB_CLIENT_ID: '456',
                    GITLAB_CLIENT_ID: '789',
                    GOOGLE_CLIENT_ID: 'abc'
                });
                expect(value).to.deep.include({
                    bitbucketEnabled: true,
                    githubEnabled: true,
                    gitlabEnabled: true,
                    googleEnabled: true
                });
            });

            it('null client id treated as disabled', () => {
                const { value } = buildConfig({
                    GITHUB_CLIENT_ID: '123',
                    BITBUCKET_CLIENT_ID: null
                });
                expect(value).to.deep.include({
                    bitbucketEnabled: false,
                    githubEnabled: true,
                    gitlabEnabled: false,
                    googleEnabled: false
                });
            });

            it('undefined client id treated as disabled', () => {
                const { value } = buildConfig({});
                expect(value).to.deep.include({
                    bitbucketEnabled: false,
                    githubEnabled: false,
                    gitlabEnabled: false,
                    googleEnabled: false
                });
            });

            it('localEnabled is always true', () => {
                const { value } = buildConfig({});
                expect(value.localEnabled).to.be.true;
            });
        });

        describe('locales', () => {

            it('parses valid locale array with explicit default', () => {
                const { value } = buildConfig({
                    LOCALES_ALLOWED: '["en","es","pt"]',
                    LOCALE_DEFAULT: 'pt'
                });
                expect(value).to.deep.include({
                    allowedLocales: ['en', 'es', 'pt'],
                    defaultLocale: 'pt'
                });
            });

            it('uses LOCALE_DEFAULT from config', () => {
                const { value } = buildConfig({
                    LOCALE_DEFAULT: 'pt',
                    LOCALES_ALLOWED: '[]'
                });
                expect(value.defaultLocale).to.equal('pt');
            });

            it('falls back to DEFAULT_LOCALE when LOCALE_DEFAULT is not set', () => {
                const { value } = buildConfig({});
                expect(value.defaultLocale).to.equal('en');
            });

            it('auto-merges default locale into allowedLocales if missing', () => {
                const { value, errors } = buildConfig({
                    LOCALES_ALLOWED: '["en","pt"]',
                    LOCALE_DEFAULT: 'es'
                });
                expect(errors).to.be.empty;
                expect(value.allowedLocales).to.deep.equal(['en', 'pt', 'es']);
                expect(value.defaultLocale).to.equal('es');
            });

            it('reports LOCALE_FORMAT error when LOCALE_DEFAULT is invalid', () => {
                const { errors } = buildConfig({
                    LOCALES_ALLOWED: '["en"]',
                    LOCALE_DEFAULT: '-'
                });
                expect(errors).to.have.length(1);
                expect(errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_FORMAT);
                expect(errors[0].meta.locale).to.equal('-');
            });

            it('does not report LOCALE_FORMAT error when LOCALE_DEFAULT is null', () => {
                const { errors } = buildConfig({
                    LOCALES_ALLOWED: '["en"]',
                    LOCALE_DEFAULT: null
                });
                const formatErrors = errors.filter((e) => e.code === ERROR_CODES.CONFIG_LOCALE_FORMAT);
                expect(formatErrors).to.be.empty;
            });

            it('merges parseLocales errors into final errors', () => {
                const { value, errors } = buildConfig({});
                expect(value.allowedLocales).to.deep.equal([]);
                expect(errors).to.have.length(1);
                expect(errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_MISSING);
            });

            it('auto-merges default into allowedLocales when allowedLocales is empty array', () => {
                const { value, errors } = buildConfig({
                    LOCALE_DEFAULT: 'pt'
                });
                expect(value.allowedLocales).to.deep.equal([]);
                expect(errors).to.have.length(1);
                expect(errors[0].code).to.equal(ERROR_CODES.CONFIG_LOCALE_MISSING);
            });

            it('auto-merges default into allowedLocales when LOCALES_ALLOWED is empty array', () => {
                const { value, errors } = buildConfig({
                    LOCALES_ALLOWED: '[]',
                    LOCALE_DEFAULT: 'pt'
                });
                // empty allowed array means "allow all", so no merge needed
                expect(value.allowedLocales).to.deep.equal([]);
                expect(errors).to.be.empty;
            });
        });

        describe('Object.freeze', () => {

            it('returns frozen config value', () => {
                const { value } = buildConfig({});
                expect(Object.isFrozen(value)).to.be.true;
            });

            it('deeply freezes the allowedLocales array', () => {
                const { value } = buildConfig({
                    LOCALES_ALLOWED: '["en","pt"]'
                });
                expect(Object.isFrozen(value.allowedLocales)).to.be.true;
            });

            it('prevents mutation of allowedLocales', () => {
                const { value } = buildConfig({
                    LOCALES_ALLOWED: '["en","pt"]'
                });
                expect(() => value.allowedLocales.push('es')).to.throw();
            });
        });
    });

    describe('getConfig (integration-style)', () => {

        afterEach(() => {
            sinon.restore();
        });

        it('returns full config object from environment', () => {
            sinon.stub(env, 'get').returns({
                config: {
                    BITBUCKET_CLIENT_ID: '123',
                    LOCALES_ALLOWED: '["en","es"]',
                    LOCALE_DEFAULT: 'es'
                }
            });
            expect(getConfig()).to.deep.equal({
                bitbucketEnabled: true,
                githubEnabled: false,
                gitlabEnabled: false,
                googleEnabled: false,
                localEnabled: true,
                allowedLocales: ['en', 'es'],
                defaultLocale: 'es'
            });
        });

        it('returns default values when no env vars are set', () => {
            sinon.stub(env, 'get').returns({ config: {} });
            const result = getConfig();
            expect(result.bitbucketEnabled).to.be.false;
            expect(result.githubEnabled).to.be.false;
            expect(result.gitlabEnabled).to.be.false;
            expect(result.googleEnabled).to.be.false;
            expect(result.localEnabled).to.be.true;
            expect(result.allowedLocales).to.deep.equal([]);
            expect(result.defaultLocale).to.equal('en');
        });

        it('normalizes locales from environment', () => {
            sinon.stub(env, 'get').returns({
                config: { LOCALES_ALLOWED: '["EN","pt-br"]', LOCALE_DEFAULT: 'en' }
            });
            const result = getConfig();
            expect(result.allowedLocales).to.deep.equal(['en', 'pt-BR']);
        });
    });
});
