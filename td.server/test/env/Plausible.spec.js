import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import PlausibleEnv from '../../src/env/Plausible.js';

describe('env/Plausible.js', () => {
    let plausibleEnv;

    const expectedProperties = [
        { key: 'ENABLED', defaultValue: false },
        { key: 'URL', defaultValue: 'https://plausible.io' },
        { key: 'DOMAIN', defaultValue: undefined }
    ];

    beforeEach(() => {
        plausibleEnv = new PlausibleEnv();
    });

    it('extends Env', () => {
        expect(plausibleEnv).is.instanceOf(Env);
    });

    it('is named Plausible', () => {
        expect(plausibleEnv.name).to.eq('Plausible');
    });

    it('uses the PLAUSIBLE_ prefix', () => {
        expect(plausibleEnv.prefix).to.eq('PLAUSIBLE_');
    });

    it('has the expected number of properties', () => {
        expect(plausibleEnv.properties).to.have.length(expectedProperties.length);
    });

    expectedProperties.forEach(({ key, defaultValue }) => {
        it(`has the optional property ${key}`, () => {
            const prop = plausibleEnv.properties.find(x => x.key === key);
            expect(prop).to.exist;
            expect(prop.required).to.be.false;
        });

        if (defaultValue !== undefined) {
            it(`has default value ${JSON.stringify(defaultValue)} for property ${key}`, () => {
                const prop = plausibleEnv.properties.find(x => x.key === key);
                expect(prop.defaultValue).to.deep.equal(defaultValue);
            });
        }
    });
});
