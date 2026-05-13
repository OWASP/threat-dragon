import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import ThreatDragonEnv from '../../src/env/ThreatDragon.js';

describe('env/ThreatDragon.js', () => {
    let tdEnv;

    const expectedProperties = [
        { key: 'NODE_ENV', defaultValue: 'production' },
        { key: 'PORT', defaultValue: 3000 },
        { key: 'LOG_MAX_FILE_SIZE', defaultValue: 24 },
        { key: 'LOG_LEVEL', defaultValue: 'warn' },
        { key: 'SERVER_API_PROTOCOL', defaultValue: 'https' },
        { key: 'REPO_ROOT_DIRECTORY', defaultValue: 'ThreatDragonModels' },
        { key: 'REPO_USE_SEARCH', defaultValue: false },
        { key: 'REPO_SEARCH_QUERY', defaultValue: undefined },
        { key: 'LOCALES_ALLOWED', defaultValue: '[]' },
        { key: 'LOCALE_DEFAULT', defaultValue: 'en' }
    ];

    beforeEach(() => {
        tdEnv = new ThreatDragonEnv();
    });

    it('extends Env', () => {
        expect(tdEnv).is.instanceOf(Env);
    });

    it('is named ThreatDragon', () => {
        expect(tdEnv.name).to.eq('ThreatDragon');
    });

    it('uses an empty prefix', () => {
        expect(tdEnv.prefix).to.eq('');
    });

    it('has the expected number of properties', () => {
        expect(tdEnv.properties).to.have.length(expectedProperties.length);
    });

    expectedProperties.forEach(({ key, defaultValue }) => {
        it(`has the optional property ${key}`, () => {
            const prop = tdEnv.properties.find(x => x.key === key);
            expect(prop).to.exist;
            expect(prop.required).to.be.false;
        });

        if (defaultValue !== undefined) {
            it(`has default value ${JSON.stringify(defaultValue)} for property ${key}`, () => {
                const prop = tdEnv.properties.find(x => x.key === key);
                expect(prop.defaultValue).to.deep.equal(defaultValue);
            });
        }
    });
});

