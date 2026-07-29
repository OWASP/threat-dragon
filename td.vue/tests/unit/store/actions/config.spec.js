import configActions, { configClear, configFetch, configLoaded, configError } from '@/store/actions/config.js';
describe('store/actions/config.js', () => {
    it('defines the clear action', () => {
        expect(configClear).not.toBeUndefined();
        expect(typeof configClear).toBe('string');
    });

    it('defines the fetch action', () => {
        expect(configFetch).not.toBeUndefined();
        expect(typeof configFetch).toBe('string');
    });

    it('defines the loaded action', () => {
        expect(configLoaded).not.toBeUndefined();
        expect(typeof configLoaded).toBe('string');
    });

    it('defines the error action', () => {
        expect(configError).not.toBeUndefined();
        expect(typeof configError).toBe('string');
    });

    it('exports exactly 4 actions under the default export', () => {
        expect(Object.keys(configActions)).toHaveLength(4);
        expect(configActions.clear).toBe(configClear);
        expect(configActions.fetch).toBe(configFetch);
        expect(configActions.loaded).toBe(configLoaded);
        expect(configActions.error).toBe(configError);
    });
});

